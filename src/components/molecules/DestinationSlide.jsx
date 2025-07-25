import React from "react";

export default function DestinationSlide({ src, alt, isActive }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
