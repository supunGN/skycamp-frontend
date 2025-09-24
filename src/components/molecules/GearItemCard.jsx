import React from "react";
import Button from "../atoms/Button";

const GearItemCard = ({
  image,
  name,
  description,
  price,
  selected,
  onSelect,
  quantity,
  onQuantityChange,
  disabled = false,
  stockQuantity = 0,
  condition = "Good",
}) => {
  const isOutOfStock = stockQuantity === 0;
  const canSelect = !disabled && !isOutOfStock;

  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-xl shadow p-3 mb-6 border border-gray-100 min-h-[90px] w-full ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        disabled={!canSelect}
        className="mt-1 accent-cyan-600"
      />
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover border"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-base text-gray-900 mb-0.5">{name}</h4>
            {condition && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {condition}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-cyan-700 font-semibold text-sm">
              {price} LKR/Day
            </span>
            {stockQuantity > 0 && (
              <div className="text-xs text-gray-500">
                {stockQuantity} available
              </div>
            )}
            {isOutOfStock && (
              <div className="text-xs text-red-500 font-medium">
                Out of Stock
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-xs mb-1 line-clamp-2">{description}</p>
        {/* Quantity Controls */}
        {canSelect && selected && (
          <div className="flex items-center gap-1 mt-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-1 font-semibold text-sm">
              {quantity.toString().padStart(2, "0")}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= stockQuantity}
            >
              +
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GearItemCard;
