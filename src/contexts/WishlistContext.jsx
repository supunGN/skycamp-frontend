import React, { createContext, useContext, useState, useEffect } from "react";
import { API } from "../api";

const WishlistContext = createContext();

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    // Return default values instead of throwing error
    return {
      items: [],
      itemCount: 0,
      loading: false,
      error: null,
      addItem: () => false,
      removeItem: () => false,
      checkItem: () => false,
      clearWishlist: () => false,
      refreshWishlist: () => {},
      isAuthenticated: false,
    };
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated and is a customer
  const isCustomerAuthenticated = () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return false;

      const userData = JSON.parse(user);
      return userData.user_role === "customer";
    } catch {
      return false;
    }
  };

  const fetchItems = async () => {
    if (!isCustomerAuthenticated()) {
      setItems([]);
      setItemCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await API.wishlist.getItems();
      if (response.success) {
        setItems(response.data);
      } else {
        setError("Failed to fetch wishlist items");
      }
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
      setError(err.message || "Failed to fetch wishlist items");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemCount = async () => {
    if (!isCustomerAuthenticated()) {
      setItemCount(0);
      return;
    }

    try {
      const response = await API.wishlist.getItemCount();
      if (response.success) {
        setItemCount(response.count);
      }
    } catch (err) {
      console.error("Error fetching wishlist count:", err);
    }
  };

  const addItem = async (itemType, itemId, itemData) => {
    if (!isCustomerAuthenticated()) {
      return false;
    }

    try {
      const response = await API.wishlist.addItem(itemType, itemId, itemData);
      if (response.success) {
        // Refresh items and count
        await fetchItems();
        await fetchItemCount();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding item to wishlist:", err);
      return false;
    }
  };

  const removeItem = async (itemType, itemId) => {
    if (!isCustomerAuthenticated()) {
      return false;
    }

    try {
      const response = await API.wishlist.removeItem(itemType, itemId);
      if (response.success) {
        // Refresh items and count
        await fetchItems();
        await fetchItemCount();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error removing item from wishlist:", err);
      return false;
    }
  };

  const checkItem = async (itemType, itemId) => {
    if (!isCustomerAuthenticated()) {
      return false;
    }

    try {
      const response = await API.wishlist.checkItem(itemType, itemId);
      if (response.success) {
        return response.in_wishlist;
      }
      return false;
    } catch (err) {
      console.error("Error checking wishlist item:", err);
      return false;
    }
  };

  const clearWishlist = async () => {
    if (!isCustomerAuthenticated()) {
      return false;
    }

    try {
      const response = await API.wishlist.clearWishlist();
      if (response.success) {
        setItems([]);
        setItemCount(0);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      return false;
    }
  };

  const refreshWishlist = async () => {
    await fetchItems();
    await fetchItemCount();
  };

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (isCustomerAuthenticated()) {
        fetchItems();
        fetchItemCount();
      } else {
        setItems([]);
        setItemCount(0);
        setLoading(false);
      }
    };

    // Listen for localStorage changes
    window.addEventListener("storage", handleStorageChange);

    // Initial load
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = {
    items,
    itemCount,
    loading,
    error,
    addItem,
    removeItem,
    checkItem,
    clearWishlist,
    refreshWishlist,
    isAuthenticated: isCustomerAuthenticated(),
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
