import React, { useState, useEffect } from "react";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import Button from "../components/atoms/Button";
import Modal from "../components/molecules/Modal";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCartContext } from "../contexts/CartContext";
import { useToast } from "../components/atoms/ToastProvider";
import PaymentService from "../services/PaymentService";

function CartTable({ cart, onQuantityChange, onRemove, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-gray-600">Loading cart...</span>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600">Add some equipment to get started!</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left border-separate border-spacing-y-4">
      <thead>
        <tr className="text-gray-500 text-sm">
          <th>Item Photo</th>
          <th>Product Name</th>
          <th>Price(per day)</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cart.items.map((item) => (
          <tr key={item.id} className="bg-white shadow rounded-lg">
            <td className="py-3">
              <img
                src={item.image || "/default-equipment.png"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            </td>
            <td className="font-medium">{item.name}</td>
            <td>LKR {item.price.toFixed(2)}</td>
            <td>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 border rounded disabled:opacity-50"
                  onClick={() => onQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-6 text-center">
                  {String(item.quantity).padStart(2, "0")}
                </span>
                <button
                  className="p-1 border rounded disabled:opacity-50"
                  onClick={() => onQuantityChange(item.id, 1)}
                  disabled={item.quantity >= item.stockQuantity}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </td>
            <td>LKR {(item.price * item.quantity).toFixed(2)}</td>
            <td>
              <button
                className="text-red-500 hover:text-red-700 text-xl"
                title="Remove"
                onClick={() => onRemove(item.id, item.name)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrderSummary({ cart, loading, onPaymentClick, processingPayment }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="w-full lg:w-96 h-full flex flex-col lg:sticky lg:top-32">
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <p className="text-gray-500 text-sm">No items in cart</p>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const advance = total * 0.5;

  return (
    <div className="w-full lg:w-96 h-full flex flex-col lg:sticky lg:top-32">
      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total</span>
          <span className="font-semibold">LKR {total.toFixed(2)}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          You are only required to pay 50% of the total rental amount now as an
          advance. The remaining balance can be paid directly to the service
          provider upon receiving the items.
        </p>
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-cyan-700">
            Total Advance Payment
          </span>
          <span className="font-semibold text-cyan-700">
            LKR {advance.toFixed(2)}
          </span>
        </div>
        <Button
          className="w-full mt-4"
          size="md"
          variant="primary"
          onClick={onPaymentClick}
          disabled={processingPayment}
        >
          {processingPayment ? "Processing..." : "Make Advance Payment"}
        </Button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { showSuccess, showError } = useToast();
  const { cart, loading, error, updateQuantity, removeItem, clearCart } =
    useCartContext();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleQuantityChange = async (cartItemId, delta) => {
    try {
      const item = cart.items.find((item) => item.id === cartItemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      if (newQuantity > item.stockQuantity) {
        showError("Insufficient stock available");
        return;
      }

      const result = await updateQuantity(cartItemId, newQuantity);

      if (result.success) {
        showSuccess("Quantity updated successfully");
      } else {
        showError(result.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      showError("Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      const result = await removeItem(cartItemId);

      if (result.success) {
        showSuccess("Item removed successfully");
      } else {
        showError(result.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      showError("Failed to remove item");
    }
  };

  const handleRemoveClick = (cartItemId, itemName) => {
    setItemToRemove({ id: cartItemId, name: itemName });
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      await handleRemove(itemToRemove.id);
      setShowConfirmModal(false);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const handlePaymentClick = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      showError("Cart is empty");
      return;
    }

    setProcessingPayment(true);

    try {
      const result = await PaymentService.processCartPayment(cart);

      if (result.success) {
        showSuccess("Redirecting to payment gateway...");
        // Clear cart after successful payment initiation
        clearCart();
      } else {
        showError(result.message || "Failed to process payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      showError("Failed to process payment. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 pt-32">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Cart
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 pt-32">
        <h1 className="text-3xl font-semibold mb-8">Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="flex-1">
            <CartTable
              cart={cart}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveClick}
              loading={loading}
            />
          </div>
          <OrderSummary
            cart={cart}
            loading={loading}
            onPaymentClick={handlePaymentClick}
            processingPayment={processingPayment}
          />
        </div>
      </main>
      <Footer />

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove Item"
        message={`Are you sure you want to remove "${itemToRemove?.name}" from your cart?`}
      />
    </div>
  );
}
