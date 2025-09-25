// PayHere Configuration
// Replace these values with your actual PayHere credentials

export const PAYHERE_CONFIG = {
  // Your PayHere Merchant ID
  merchantId: "1232165",

  // Your PayHere Merchant Secret (for hash generation)
  merchantSecret: "MzYzOTg5OTcyMDI2MjY0OTkwNjEyNTcyMDQ4MzkwMjE0MDYwMzI3OQ==",

  // Set to false for production
  sandbox: true,

  // Currency
  currency: "LKR",

  // PayHere URLs
  checkoutUrl: "https://sandbox.payhere.lk/pay/checkout", // Production: https://www.payhere.lk/pay/checkout

  // Return URLs (these should match your frontend routes)
  returnUrl: `${window.location.origin}/payment/success`,
  cancelUrl: `${window.location.origin}/payment/cancel`,
  notifyUrl: `${window.location.origin}/api/payment/notify`, // This will be handled by your backend
};

// Instructions for setup:
// 1. Replace 'your_merchant_id_here' with your actual PayHere merchant ID
// 2. Make sure your PayHere dashboard has the correct return URLs configured
// 3. For production, change sandbox: false and use production URLs
// 4. Ensure your backend can handle the notify URL for payment confirmations
