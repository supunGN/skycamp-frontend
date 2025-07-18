"use client";

import { twMerge } from "tailwind-merge";

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-6 py-3",
};

const variantClasses = {
  primary:
    "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 active:ring-cyan-600",
  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 active:ring-gray-300",
  outline:
    "bg-transparent border border-cyan-600 text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 active:ring-cyan-600",
};

export default function Button({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
  size = "md",
  variant = "primary",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200",
        sizeClasses[size],
        variantClasses[variant],
        "active:ring-4 active:ring-offset-2",
        "disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-0 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
