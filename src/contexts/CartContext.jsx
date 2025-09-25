import React, { createContext, useContext, useState, useEffect } from "react";
import { API } from "../api";

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemCount, setItemCount] = useState(0);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.cart.get();

      if (response.success) {
        setCart(response.data);
        setItemCount(response.data?.items?.length || 0);
      } else {
        setCart(null);
        setItemCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
      setCart(null);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const response = await API.cart.updateQuantity(cartItemId, quantity);

      if (response.success) {
        // Refresh cart data
        await fetchCart();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      return { success: false, message: err.message };
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId) => {
    try {
      const response = await API.cart.removeItem(cartItemId);

      if (response.success) {
        // Refresh cart data
        await fetchCart();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error removing item:", err);
      return { success: false, message: err.message };
    }
  };

  // Add items to cart (from individual renter page)
  const addToCart = async (cartData) => {
    try {
      console.log("CartContext - addToCart received data:", cartData);
      const response = await API.cart.create(cartData);

      if (response.success) {
        // Refresh cart data
        await fetchCart();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: err.message };
    }
  };

  // Clear cart (for checkout or other operations)
  const clearCart = () => {
    setCart(null);
    setItemCount(0);
  };

  // Check if user is logged in and fetch cart on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setItemCount(0);
    }
  }, []);

  const value = {
    cart,
    loading,
    error,
    itemCount,
    fetchCart,
    updateQuantity,
    removeItem,
    addToCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
