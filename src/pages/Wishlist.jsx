import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  TrashIcon,
  EyeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWishlistContext } from "../contexts/WishlistContext";
import Button from "../components/atoms/Button";
import Navbar from "../components/organisms/Navbar";
import Footer from "../components/organisms/Footer";
import HorizontalTabs from "../components/molecules/HorizontalTabs";
import StaticSection from "../components/sections/StaticSection";
import DestinationCard from "../components/molecules/destination/DestinationCard";
import RentalCard from "../components/molecules/RentalCard";
import GuideCard from "../components/molecules/GuideCard";

export default function Wishlist() {
  const {
    items,
    loading,
    error,
    removeItem,
    clearWishlist,
    itemCount,
    isAuthenticated,
  } = useWishlistContext();
  const [removingItems, setRemovingItems] = useState(new Set());
  const [activeTab, setActiveTab] = useState("rentals");

  // Debug logging
  console.log("Wishlist Debug:", {
    isAuthenticated,
    items,
    itemCount,
    loading,
    error,
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.replace("/login");
    return null;
  }

  // Define tabs for filtering wishlist items
  const tabs = [
    {
      key: "rentals",
      label: "Rentals",
      count: items.filter((item) => item.item_type === "equipment").length,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      activeBg: "bg-blue-200",
      activeText: "text-blue-800",
    },
    {
      key: "guides",
      label: "Guides",
      count: items.filter((item) => item.item_type === "guide").length,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
      activeBg: "bg-purple-200",
      activeText: "text-purple-800",
    },
    {
      key: "stargazing",
      label: "Stargazing Spots",
      count: items.filter(
        (item) =>
          item.item_type === "location" && item.location_type === "Stargazing"
      ).length,
      color: "text-green-700",
      bgColor: "bg-green-100",
      activeBg: "bg-green-200",
      activeText: "text-green-800",
    },
    {
      key: "camping",
      label: "Camping Destinations",
      count: items.filter(
        (item) =>
          item.item_type === "location" && item.location_type === "Camping"
      ).length,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
      activeBg: "bg-orange-200",
      activeText: "text-orange-800",
    },
  ];

  // Filter items based on active tab
  const filteredItems = (() => {
    switch (activeTab) {
      case "rentals":
        return items.filter((item) => item.item_type === "equipment");
      case "guides":
        return items.filter((item) => item.item_type === "guide");
      case "stargazing":
        return items.filter(
          (item) =>
            item.item_type === "location" && item.location_type === "Stargazing"
        );
      case "camping":
        return items.filter(
          (item) =>
            item.item_type === "location" && item.location_type === "Camping"
        );
      default:
        return items;
    }
  })();

  const handleRemoveItem = async (itemType, itemId) => {
    setRemovingItems((prev) => new Set(prev).add(`${itemType}-${itemId}`));
    try {
      await removeItem(itemType, itemId);
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(`${itemType}-${itemId}`);
        return newSet;
      });
    }
  };

  const handleClearWishlist = async () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      await clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <HeartIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Wishlist
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Static Section Header */}
      <StaticSection
        heading="My Wishlist"
        paragraph={`${items.length} ${
          items.length === 1 ? "item" : "items"
        } saved for later`}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clear All Button and Horizontal Tabs */}
          <div className="mb-8 flex items-center justify-between">
            {/* Horizontal Tabs */}
            <div className="flex-1">
              <HorizontalTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="mb-0"
              />
            </div>

            {/* Clear All Button - Only show when there are items */}
            {items.length > 0 && (
              <div className="ml-6">
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Wishlist Items */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No{" "}
                {activeTab === "rentals"
                  ? "rentals"
                  : activeTab === "guides"
                  ? "guides"
                  : activeTab === "stargazing"
                  ? "stargazing spots"
                  : activeTab === "camping"
                  ? "camping destinations"
                  : "items"}{" "}
                in your wishlist
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring and add{" "}
                {activeTab === "rentals"
                  ? "equipment"
                  : activeTab === "guides"
                  ? "guides"
                  : activeTab === "stargazing"
                  ? "stargazing spots"
                  : activeTab === "camping"
                  ? "camping destinations"
                  : "items"}{" "}
                you love to your wishlist!
              </p>
              <div className="flex gap-4 justify-center">
                {activeTab === "rentals" && (
                  <Link to="/rentals">
                    <Button variant="primary">Browse Equipment</Button>
                  </Link>
                )}
                {activeTab === "guides" && (
                  <Link to="/guides">
                    <Button variant="primary">Find Guides</Button>
                  </Link>
                )}
                {activeTab === "stargazing" && (
                  <Link to="/stargazing-spots">
                    <Button variant="primary">Explore Stargazing Spots</Button>
                  </Link>
                )}
                {activeTab === "camping" && (
                  <Link to="/destinations">
                    <Button variant="primary">
                      Discover Camping Destinations
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isRemoving = removingItems.has(
                  `${item.item_type}-${item.item_id}`
                );

                // Render different card types based on item type
                if (item.item_type === "location") {
                  return (
                    <DestinationCard
                      key={`${item.item_type}-${item.item_id}`}
                      image={item.image_url || "/placeholder.svg"}
                      name={item.name}
                      description={item.description}
                      rating={4.5} // Default rating
                      reviewCount={50} // Fixed review count
                      locationId={item.item_id}
                      onCardClick={(name) => {
                        // Navigate to destination details
                        const urlFriendlyName = name
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .trim();
                        window.location.href = `/destination/${item.item_id}/${urlFriendlyName}`;
                      }}
                    />
                  );
                } else if (item.item_type === "equipment") {
                  return (
                    <RentalCard
                      key={`${item.item_type}-${item.item_id}`}
                      image={item.image_url || "/placeholder.svg"}
                      location="Equipment Rental"
                      name={item.name}
                      phone="Contact for details"
                      rating={4.5} // Default rating
                      reviewCount={30} // Fixed review count
                      equipmentId={item.item_id}
                    />
                  );
                } else if (item.item_type === "guide") {
                  return (
                    <GuideCard
                      key={`${item.item_type}-${item.item_id}`}
                      location="Guide Service"
                      name={item.name}
                      contact="Contact for details"
                      rate={
                        item.price ? `${item.price} LKR/Day` : "Rate on request"
                      }
                      rating={4.5} // Default rating
                      reviews={25} // Fixed review count
                      profileImage={item.image_url || "/placeholder.svg"}
                      guideId={item.item_id}
                    />
                  );
                }

                // Fallback for unknown item types
                return (
                  <div
                    key={`${item.item_type}-${item.item_id}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Item Image */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <HeartIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Content */}
                    <div className="p-6">
                      {/* Item Type Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.item_type === "equipment"
                            ? "Equipment"
                            : item.item_type === "location"
                            ? "Location"
                            : item.item_type === "guide"
                            ? "Guide"
                            : "Item"}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.item_type, item.item_id)
                          }
                          disabled={isRemoving}
                          className="text-red-400 hover:text-red-600 disabled:opacity-50"
                        >
                          <HeartSolidIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Item Name */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Item Description */}
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {/* Item Price */}
                      {item.price && (
                        <p className="text-lg font-semibold text-cyan-600 mb-4">
                          {item.price
                            ? `$${item.price.toFixed(2)}`
                            : "Price on request"}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // Navigate to item details based on type
                            const basePath =
                              item.item_type === "equipment"
                                ? "/rentals"
                                : item.item_type === "location"
                                ? "/destinations"
                                : "/guides";
                            window.location.href = `${basePath}/${item.item_id}`;
                          }}
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            // Add to cart logic here
                          }}
                        >
                          <ShoppingCartIcon className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
