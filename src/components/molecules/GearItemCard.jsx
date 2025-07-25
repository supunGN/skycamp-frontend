import React from "react";
import Button from "../atoms/Button";

const GearItemCard = ({ image, name, description, price, selected, onSelect, quantity, onQuantityChange }) => {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl shadow p-3 mb-6 border border-gray-100 min-h-[90px] w-full">
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="mt-1 accent-cyan-600"
      />
      <img src={image} alt={name} className="w-16 h-16 rounded-lg object-cover border" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-base text-gray-900 mb-0.5">{name}</h4>
          <span className="text-cyan-700 font-semibold text-sm">{price} LKR/Day</span>
        </div>
        <p className="text-gray-600 text-xs mb-1 line-clamp-2">{description}</p>
        {/* Quantity Controls */}
        <div className="flex items-center gap-1 mt-1">
          <Button size="sm" variant="secondary" onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>-</Button>
          <span className="px-1 font-semibold text-sm">{quantity.toString().padStart(2, '0')}</span>
          <Button size="sm" variant="secondary" onClick={() => onQuantityChange(quantity + 1)}>+</Button>
        </div>
      </div>
    </div>
  );
};

export default GearItemCard; 