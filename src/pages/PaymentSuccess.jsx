import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import { useToast } from "../components/atoms/ToastProvider";
import PaymentService from "../services/PaymentService";
import {
  validatePayHereResponse,
  extractPaymentDetails,
} from "../utils/payhere";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [processing, setProcessing] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    handlePaymentSuccess();
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      // Validate PayHere response
      const validation = validatePayHereResponse(searchParams);
      if (!validation.valid) {
        showError(validation.message);
        navigate("/cart");
        return;
      }

      // Extract payment details
      const details = extractPaymentDetails(searchParams);
      setPaymentDetails(details);

      // Confirm payment with backend
      const result = await PaymentService.handlePaymentSuccess(details);

      if (result.success) {
        console.log("PaymentSuccess - result:", result);
        console.log("PaymentSuccess - booking:", result.booking);
        console.log("PaymentSuccess - items:", result.items);
        console.log("PaymentSuccess - payment:", result.payment);

        setBookingDetails({
          ...result.booking,
          items: result.items || [],
        });

        // Update payment details with data from booking (fallback to payments table)
        if (result.payment) {
          setPaymentDetails({
            ...details,
            amount: result.payment.amount,
            paymentId: result.payment.gateway_txn_id || details.paymentId,
          });
        } else if (result.booking) {
          // Use booking data as fallback
          setPaymentDetails({
            ...details,
            amount:
              result.booking.advance_paid ||
              result.booking.total_amount ||
              details.amount,
            paymentId: details.paymentId || "Processing...",
          });
        }

        showSuccess(
          "Payment confirmed successfully! Your booking is now active."
        );
      } else {
        showError(result.message || "Failed to confirm payment");
      }
    } catch (error) {
      console.error("Payment success handling error:", error);
      showError("Failed to process payment confirmation");
    } finally {
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 pt-32">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 pt-32">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your advance payment has been processed successfully. Your equipment
            booking is now confirmed.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium">
                    {paymentDetails.paymentId || "Processing..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    LKR {paymentDetails.amount || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
              </div>
            </div>
          )}

          {/* Booking Details */}
          {bookingDetails && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">
                    {bookingDetails.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Period:</span>
                  <span className="font-medium">
                    {bookingDetails.startDate && bookingDetails.endDate
                      ? `${new Date(
                          bookingDetails.startDate
                        ).toLocaleDateString()} - ${new Date(
                          bookingDetails.endDate
                        ).toLocaleDateString()}`
                      : "Dates not available"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">
                    {bookingDetails.items?.length || 0} items
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">
              Next Steps
            </h3>
            <ul className="text-yellow-700 space-y-2">
              <li>• You will receive a confirmation email shortly</li>
              <li>• The renter will contact you to arrange pickup</li>
              <li>• Pay the remaining 50% directly to the renter</li>
              <li>• Keep this page for your records</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => navigate("/profile")}>
              View My Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
