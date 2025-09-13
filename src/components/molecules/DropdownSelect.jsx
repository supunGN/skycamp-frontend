import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function DropdownSelect({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full lg:flex-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white border border-gray-300 text-gray-700 rounded-xl px-4 py-3 h-12 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
      >
        <span className={`text-sm ${selected ? "text-gray-900" : "text-gray-500"}`}>
          {selected || label || "Select"}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-700 text-sm"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
