"use client";

import { Star } from "lucide-react";
import WishlistButton from "../../atoms/WishlistButton";

const DestinationCard = ({
  image,
  name,
  description,
  rating,
  reviewCount,
  onCardClick,
  locationId,
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(name);
    }
  };

  // Generate star rating display
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden w-full"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button Overlay */}
        <div className="absolute top-4 right-4">
          <WishlistButton
            itemType="location"
            itemId={locationId}
            itemData={{
              name: name,
              description: description,
              image_url: image,
              price: null, // Locations don't have prices
            }}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-6">
        {/* Destination Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-200">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-gray-600">
          {description}
        </p>

        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>

          <div className="flex items-center gap-1">{renderStars()}</div>

          <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
