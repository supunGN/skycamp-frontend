// PayHere Payment Integration
// Documentation: https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout

import { PAYHERE_CONFIG } from "../config/payhere";
import CryptoJS from "crypto-js";

// Generate PayHere hash for security
export const generatePayHereHash = (
  merchantId,
  orderId,
  amount,
  currency,
  merchantSecret
) => {
  // Format amount to 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);

  // Create the hash string as per PayHere specification
  const hashString =
    merchantId +
    orderId +
    formattedAmount +
    currency +
    CryptoJS.MD5(merchantSecret).toString().toUpperCase();

  // Generate MD5 hash and convert to uppercase
  const hash = CryptoJS.MD5(hashString).toString().toUpperCase();

  return hash;
};

// Generate unique order ID
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `SKYCAMP_${timestamp}_${random}`.toUpperCase();
};

// Create PayHere payment object
export const createPayHerePayment = (cartData, orderId) => {
  const { cart, advanceAmount, totalAmount } = cartData;

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  // Calculate rental period in days
  const startDate = new Date(cart.startDate);
  const endDate = new Date(cart.endDate);
  const rentalDays =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  // Create item description
  const itemDescription = cart.items
    .map((item) => `${item.name} (x${item.quantity})`)
    .join(", ");

  // Generate hash for security
  const hash = generatePayHereHash(
    PAYHERE_CONFIG.merchantId,
    orderId,
    advanceAmount,
    PAYHERE_CONFIG.currency,
    PAYHERE_CONFIG.merchantSecret
  );

  // Extract city from address or use default
  const address =
    userData.home_address || userData.address || "No address provided";
  const city = userData.city || "Colombo"; // You might want to extract this from address

  const paymentData = {
    // Required fields
    merchant_id: PAYHERE_CONFIG.merchantId,
    return_url: PAYHERE_CONFIG.returnUrl,
    cancel_url: PAYHERE_CONFIG.cancelUrl,
    notify_url: PAYHERE_CONFIG.notifyUrl,

    // Order details
    order_id: orderId,
    items: `SkyCamp Equipment Rental - ${itemDescription}`,
    currency: PAYHERE_CONFIG.currency,
    amount: advanceAmount.toFixed(2),

    // Customer details from user profile
    first_name: userData.first_name || "Customer",
    last_name: userData.last_name || "Name",
    email: userData.email || "customer@example.com",
    phone: userData.phone || userData.phone_number || "0771234567",
    address: address,
    city: city,
    country: "Sri Lanka",

    // Additional order info
    delivery_address: address,
    delivery_city: city,
    delivery_country: "Sri Lanka",

    // Custom fields for your system
    custom_1: cart.cartId, // Cart ID
    custom_2: cart.renterId, // Renter ID
    custom_3: cart.startDate, // Rental start date
    custom_4: cart.endDate, // Rental end date
    custom_5: rentalDays.toString(), // Rental period in days

    // Security hash (required by PayHere)
    hash: hash,
  };

  return paymentData;
};

// Create PayHere form and submit
export const initiatePayHerePayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      // Create form element
      const form = document.createElement("form");
      form.method = "POST";
      form.action = PAYHERE_CONFIG.checkoutUrl;
      form.target = "_blank"; // Open in new tab

      // Add form fields
      Object.keys(paymentData).forEach((key) => {
        if (paymentData[key]) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = paymentData[key];
          form.appendChild(input);
        }
      });

      // Add form to page and submit
      document.body.appendChild(form);
      form.submit();

      // Clean up
      document.body.removeChild(form);

      resolve({
        success: true,
        message: "Payment form submitted successfully",
      });
    } catch (error) {
      reject({ success: false, message: "Failed to initiate payment", error });
    }
  });
};

// Validate PayHere response (for success/cancel pages)
export const validatePayHereResponse = (urlParams) => {
  console.log(
    "validatePayHereResponse - All params:",
    Object.fromEntries(urlParams.entries())
  );

  // Check for basic order identification
  if (!urlParams.get("order_id")) {
    return { valid: false, message: "Missing required parameter: order_id" };
  }

  // For success page, we need at least order_id
  const orderId = urlParams.get("order_id");
  const amount = urlParams.get("payhere_amount") || urlParams.get("amount");

  console.log("validatePayHereResponse - orderId:", orderId, "amount:", amount);

  // If we have order_id, consider it valid (amount might not always be present)
  if (orderId) {
    return { valid: true, message: "Response is valid" };
  }

  return { valid: false, message: "Missing required payment parameters" };
};

// Extract payment details from URL parameters
export const extractPaymentDetails = (urlParams) => {
  console.log(
    "extractPaymentDetails - All URL params:",
    Object.fromEntries(urlParams.entries())
  );

  // PayHere sends back these parameters on success
  const details = {
    orderId: urlParams.get("order_id") || null,
    paymentId:
      urlParams.get("payment_id") || urlParams.get("gateway_txn_id") || null,
    amount: urlParams.get("payhere_amount") || urlParams.get("amount") || null,
    currency:
      urlParams.get("payhere_currency") || urlParams.get("currency") || "LKR",
    statusCode: urlParams.get("status_code") || urlParams.get("status") || null,
    method: urlParams.get("method") || "PayHere",
    message: urlParams.get("message") || "Payment completed",
    custom1: urlParams.get("custom_1"),
    custom2: urlParams.get("custom_2"),
    custom3: urlParams.get("custom_3"),
    custom4: urlParams.get("custom_4"),
    custom5: urlParams.get("custom_5"),
  };

  console.log("extractPaymentDetails - Extracted details:", details);
  return details;
};
