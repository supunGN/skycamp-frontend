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

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [processing, setProcessing] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    handlePaymentCancel();
  }, []);

  const handlePaymentCancel = async () => {
    try {
      // Extract payment details if available
      const details = extractPaymentDetails(searchParams);
      setPaymentDetails(details);

      // Handle payment cancellation with backend
      if (details.orderId) {
        await PaymentService.handlePaymentFailure(details);
      }
    } catch (error) {
      console.error("Payment cancel handling error:", error);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Cancellation
            </h2>
            <p className="text-gray-600">
              Please wait while we process your payment cancellation...
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
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your payment has been cancelled. No charges have been made to your
            account.
          </p>

          {/* Payment Details */}
          {paymentDetails && paymentDetails.orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">
                Transaction Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-yellow-600">Cancelled</span>
                </div>
                {paymentDetails.message && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium">
                      {paymentDetails.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">
              What happens next?
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Your cart items are still available</li>
              <li>• You can try the payment again</li>
              <li>• No charges have been made to your account</li>
              <li>• You can modify your cart if needed</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => navigate("/cart")}>
              Back to Cart
            </Button>
            <Button variant="outline" onClick={() => navigate("/rentals")}>
              Browse Rentals
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCancel;
