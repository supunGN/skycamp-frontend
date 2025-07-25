import React, { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { FiMapPin } from "react-icons/fi";
import profilePic from "../../assets/auth/profile-pic.svg";

export default function GuideCard({
  location,
  name,
  contact,
  rate,
  rating,
  reviews,
  profileImage,
  isFavorite = false,
  onFavoriteToggle,
}) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavorite = () => {
    setFavorite((prev) => !prev);
    if (onFavoriteToggle) onFavoriteToggle(!favorite);
  };

  return (
    <div className="bg-white rounded-2xl p-4 flex w-full max-w-xl mx-auto items-center">
      {/* Profile Image */}
      <div className="flex-shrink-0 mr-6">
        <img
          src={profileImage || profilePic}
          alt={name}
          className="w-32 h-32 object-cover rounded-2xl"
        />
      </div>
      {/* Details */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-cyan-700 font-semibold text-sm gap-1">
            <FiMapPin className="w-4 h-4 text-cyan-500 mr-1" />
            <span>{location}</span>
          </div>
          <button
            onClick={handleFavorite}
            className="bg-transparent rounded-full p-1 hover:bg-cyan-50 transition"
            aria-label="Favorite"
            type="button"
          >
            <HeartIcon
              className={`w-6 h-6 ${
                favorite ? "text-cyan-600" : "text-gray-300"
              }`}
              fill={favorite ? "#06b6d4" : "none"}
            />
          </button>
        </div>
        <div className="font-bold text-lg text-gray-900 truncate">{name}</div>
        <div className="text-gray-600 text-sm">{contact}</div>
        <div className="font-bold text-cyan-700 text-base">{rate} LKR/Day</div>
        <div className="flex items-center gap-1 text-sm mt-1">
          <span className="font-semibold text-yellow-500">{rating}</span>
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
            ))}
          </span>
          <span className="text-gray-500 ml-1">({reviews})</span>
        </div>
      </div>
    </div>
  );
}
