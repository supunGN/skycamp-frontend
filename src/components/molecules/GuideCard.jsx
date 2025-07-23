import React, { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
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
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col w-full max-w-xs mx-auto">
      <div className="relative mb-4">
        <img
          src={profileImage || profilePic}
          alt={name}
          className="w-full h-40 object-cover rounded-xl"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-cyan-50 transition"
          aria-label="Favorite"
        >
          <HeartIcon
            className={`w-6 h-6 ${favorite ? "text-cyan-600" : "text-gray-300"}`}
            fill={favorite ? "#06b6d4" : "none"}
          />
        </button>
      </div>
      <div className="mb-1 text-xs text-cyan-700 font-semibold flex items-center gap-1">
        <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full"></span>
        {location}
      </div>
      <div className="font-bold text-lg text-gray-900 mb-1 truncate">{name}</div>
      <div className="text-gray-600 text-sm mb-1">{contact}</div>
      <div className="font-bold text-cyan-700 text-base mb-2">{rate} LKR/Day</div>
      <div className="flex items-center gap-1 text-sm">
        <span className="font-semibold text-yellow-500">{rating}</span>
        <span className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
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
  );
} 