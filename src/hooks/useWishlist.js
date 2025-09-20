import { useState, useEffect } from "react";
import { API } from "../api";

export function useWishlist(refreshKey = 0) {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
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

  useEffect(() => {
    // Only fetch if refreshKey > 0 (user is logged in)
    if (refreshKey > 0) {
      fetchItems();
      fetchItemCount();
    } else {
      // User not logged in, clear data
      setItems([]);
      setItemCount(0);
      setLoading(false);
    }
  }, [refreshKey]);

  return {
    items,
    itemCount,
    loading,
    error,
    addItem,
    removeItem,
    checkItem,
    clearWishlist,
    refetch: fetchItems,
    refetchCount: fetchItemCount,
  };
}
