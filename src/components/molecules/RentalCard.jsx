import React from "react";
import WishlistButton from "../atoms/WishlistButton";
import profilePic from "../../assets/auth/profile-pic.svg";

// RentalCard component for displaying rental package info
const RentalCard = ({
  image,
  location,
  name,
  phone,
  rating,
  reviewCount,
  equipmentId,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden w-full relative">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={image || profilePic}
          alt={name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist Button Overlay */}
        <div className="absolute top-4 right-4">
          <WishlistButton
            itemType="equipment"
            itemId={equipmentId}
            itemData={{
              name: name,
              description: `Equipment rental in ${location}`,
              image_url: image,
              price: null, // Price would come from equipment data
            }}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200"
          />
        </div>
      </div>
      {/* Content Container */}
      <div className="p-4 sm:p-6">
        {/* Location */}
        <div className="text-xs font-semibold text-cyan-700 mb-1 flex items-center gap-1">
          <span>{location}</span>
        </div>
        {/* Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors duration-200">
          {name}
        </h3>
        {/* Phone */}
        <div className="text-sm text-gray-700 mb-2">{phone}</div>
        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1">
            {/* Render 5 stars, filled based on rating */}
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <polygon points="9.9,1.1 12.3,6.6 18.2,7.3 13.7,11.6 15,17.4 9.9,14.3 4.8,17.4 6.1,11.6 1.6,7.3 7.5,6.6 " />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
