import React, { useEffect } from "react";

const typeStyles = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-cyan-600 text-white",
};

export default function Notification({
  type = "info",
  message,
  onClose,
  duration = 3500,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-transform transform animate-slideIn rounded shadow-lg px-6 py-3 ${typeStyles[type]}`}
      style={{ minWidth: 240 }}
    >
      <span className="font-medium">{message}</span>
    </div>
  );
}

// Tailwind animation (add to global CSS if not present):
// @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
// .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.4,0,0.2,1); }
