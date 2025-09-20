import React, { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWishlistContext } from "../../contexts/WishlistContext";
import { useToast } from "./ToastProvider";

export default function WishlistButton({
  itemType,
  itemId,
  itemData,
  className = "",
  showText = false,
  isAuthenticated = false, // Add authentication prop
}) {
  const {
    addItem,
    removeItem,
    checkItem,
    isAuthenticated: contextAuth,
  } = useWishlistContext();
  const { showSuccess, showError } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use context authentication status if not provided as prop
  const authenticated = isAuthenticated || contextAuth;

  // Don't render if user is not a customer
  if (!authenticated) {
    return null;
  }

  useEffect(() => {
    const checkWishlistStatus = async () => {
      // Don't check if itemId is invalid or user is not authenticated
      if (
        !itemId ||
        itemId === "undefined" ||
        itemId === "null" ||
        !authenticated
      ) {
        return;
      }

      try {
        const inWishlist = await checkItem(itemType, itemId);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [itemType, itemId, checkItem, authenticated]);

  const getItemTypeLabel = (type) => {
    switch (type) {
      case "equipment":
        return "Renter";
      case "location":
        return "Destination";
      case "guide":
        return "Guide";
      default:
        return "Item";
    }
  };

  const handleToggleWishlist = async (e) => {
    // Prevent navigation and event bubbling
    e.preventDefault();
    e.stopPropagation();

    // Don't proceed if user is not authenticated
    if (!authenticated) {
      showError("Please log in to use wishlist");
      return;
    }

    // Don't proceed if itemId is invalid
    if (!itemId || itemId === "undefined" || itemId === "null") {
      console.warn(`Cannot toggle wishlist for invalid itemId:`, itemId);
      showError("Invalid item ID");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isInWishlist) {
        const success = await removeItem(itemType, itemId);
        if (success) {
          setIsInWishlist(false);
          showSuccess(`${getItemTypeLabel(itemType)} removed from wishlist`);
        } else {
          showError(
            `Failed to remove ${getItemTypeLabel(
              itemType
            ).toLowerCase()} from wishlist`
          );
        }
      } else {
        const success = await addItem(itemType, itemId, itemData);
        if (success) {
          setIsInWishlist(true);
          showSuccess(`${getItemTypeLabel(itemType)} added to wishlist`);
        } else {
          showError(
            `Failed to add ${getItemTypeLabel(
              itemType
            ).toLowerCase()} to wishlist`
          );
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showError(`Failed to update wishlist`);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if itemId is invalid
  if (!itemId || itemId === "undefined" || itemId === "null") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
        ${
          isInWishlist
            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}
        ${className}
      `}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <HeartSolidIcon className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isInWishlist ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
