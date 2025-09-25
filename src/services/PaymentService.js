import { API } from "../api";
import {
  generateOrderId,
  createPayHerePayment,
  initiatePayHerePayment,
} from "../utils/payhere";

class PaymentService {
  /**
   * Process cart payment with PayHere
   * @param {Object} cart - Cart data from context
   * @returns {Promise} Payment result
   */
  async processCartPayment(cart) {
    try {
      console.log("Cart data received:", cart);

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Generate unique order ID
      const orderId = generateOrderId();

      // Calculate amounts
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const advanceAmount = totalAmount * 0.5; // 50% advance payment

      // Create payment data
      const paymentData = createPayHerePayment(
        {
          cart,
          advanceAmount,
          totalAmount,
        },
        orderId
      );

      // First, create a pending booking in our system
      const bookingResponse = await this.createPendingBooking({
        cart,
        orderId,
        totalAmount,
        advanceAmount,
      });

      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || "Failed to create booking");
      }

      // Then initiate PayHere payment
      const paymentResult = await initiatePayHerePayment(paymentData);

      return {
        success: true,
        message: "Payment initiated successfully",
        orderId,
        bookingId: bookingResponse.bookingId,
        paymentData,
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        message: error.message || "Failed to process payment",
        error,
      };
    }
  }

  /**
   * Create a pending booking in our system
   * @param {Object} bookingData - Booking details
   * @returns {Promise} Booking creation result
   */
  async createPendingBooking(bookingData) {
    try {
      // First, update the existing cart with order_id
      await this.updateCartWithOrderId(
        bookingData.cart.cartId,
        bookingData.orderId
      );

      // Then create the booking
      const bookingRequestData = {
        cartId: bookingData.cart.cartId,
        orderId: bookingData.orderId,
        renterId: bookingData.cart.renterId,
        items: bookingData.cart.items.map((item) => ({
          renterEquipmentId: item.renterEquipmentId,
          quantity: item.quantity,
          pricePerDay: item.price,
        })),
        startDate: bookingData.cart.startDate,
        endDate: bookingData.cart.endDate,
        totalAmount: bookingData.totalAmount,
        advanceAmount: bookingData.advanceAmount,
        status: "Confirmed", // PayHere expects confirmed status initially
      };

      console.log("Sending booking request data:", bookingRequestData);
      const response = await API.bookings.create(bookingRequestData);

      return {
        success: response.success,
        bookingId: response.data?.bookingId,
        message: response.message,
      };
    } catch (error) {
      console.error("Booking creation error:", error);
      return {
        success: false,
        message: error.message || "Failed to create booking",
        error,
      };
    }
  }

  /**
   * Update cart with order ID
   * @param {string} cartId - Cart ID
   * @param {string} orderId - Order ID
   * @returns {Promise} Update result
   */
  async updateCartWithOrderId(cartId, orderId) {
    try {
      // For now, we'll just store the order_id in localStorage
      // In a real implementation, you'd make an API call to update the cart
      localStorage.setItem("current_order_id", orderId);
      return { success: true };
    } catch (error) {
      console.error("Cart update error:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Handle payment success
   * @param {Object} paymentDetails - Payment details from PayHere
   * @returns {Promise} Success handling result
   */
  async handlePaymentSuccess(paymentDetails) {
    try {
      console.log(
        "PaymentService - handlePaymentSuccess called with:",
        paymentDetails
      );

      // Get amount from localStorage if not provided by PayHere
      let paymentAmount = paymentDetails.amount;
      if (!paymentAmount) {
        const storedOrder = localStorage.getItem("current_order_id");
        if (storedOrder === paymentDetails.orderId) {
          // Try to get amount from cart data
          const cartData = localStorage.getItem("cart_data");
          if (cartData) {
            const cart = JSON.parse(cartData);
            paymentAmount = cart.advanceAmount || cart.totalAmount * 0.5;
          }
        }
      }

      const paymentData = {
        orderId: paymentDetails.orderId,
        paymentId: paymentDetails.paymentId || "N/A",
        amount: paymentAmount || 0,
        statusCode: paymentDetails.statusCode || "2", // 2 = Success in PayHere
        paymentDetails,
      };

      console.log("PaymentService - Sending to backend:", paymentData);

      const response = await API.bookings.confirmPayment(paymentData);

      if (response.success && response.data) {
        // Try to fetch full booking details, but don't fail if it doesn't work
        try {
          const bookingResponse = await API.bookings.show(
            response.data.bookingId
          );

          // Get payment details from the payments table
          const paymentResponse = await API.bookings.getPaymentDetails(
            response.data.bookingId
          );

          return {
            success: true,
            message: response.message || "Payment confirmed successfully",
            booking: bookingResponse.data?.booking || response.data,
            items: bookingResponse.data?.items || [],
            payment: paymentResponse.data?.payment || null,
          };
        } catch (bookingError) {
          console.log(
            "Could not fetch booking details, using basic response:",
            bookingError
          );
          return {
            success: true,
            message: response.message || "Payment confirmed successfully",
            booking: response.data,
            items: [],
            payment: null,
          };
        }
      }

      return {
        success: response.success,
        message: response.message || "Payment confirmed successfully",
        booking: response.data,
      };
    } catch (error) {
      console.error("Payment success handling error:", error);
      return {
        success: false,
        message: error.message || "Failed to confirm payment",
        error,
      };
    }
  }

  /**
   * Handle payment failure
   * @param {Object} paymentDetails - Payment details from PayHere
   * @returns {Promise} Failure handling result
   */
  async handlePaymentFailure(paymentDetails) {
    try {
      const response = await API.bookings.cancelPayment({
        orderId: paymentDetails.orderId,
        paymentId: paymentDetails.paymentId,
        reason: "Payment failed or cancelled",
        paymentDetails,
      });

      return {
        success: response.success,
        message: response.message || "Payment cancelled successfully",
      };
    } catch (error) {
      console.error("Payment failure handling error:", error);
      return {
        success: false,
        message: error.message || "Failed to cancel payment",
        error,
      };
    }
  }

  /**
   * Get payment status
   * @param {string} orderId - Order ID
   * @returns {Promise} Payment status
   */
  async getPaymentStatus(orderId) {
    try {
      const response = await API.bookings.getPaymentStatus(orderId);

      return {
        success: response.success,
        status: response.data?.status,
        message: response.message,
      };
    } catch (error) {
      console.error("Payment status error:", error);
      return {
        success: false,
        message: error.message || "Failed to get payment status",
        error,
      };
    }
  }
}

// Export singleton instance
export default new PaymentService();
