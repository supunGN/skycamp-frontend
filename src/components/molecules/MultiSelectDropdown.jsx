import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function MultiSelectDropdown({
  label = "Select",
  options = [],
  defaultSelected = [],
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(defaultSelected);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle selection
  const toggleSelection = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Remove selected item
  const removeSelection = (option) => {
    setSelected((prev) => prev.filter((item) => item !== option));
  };

  // Filtered options based on search
  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Button & Tags */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
            {selected.length > 0 ? (
              selected.map((item) => (
                <span
                  key={item}
                  className="bg-cyan-100 text-cyan-700 text-xs font-medium px-2 py-1 rounded-full flex items-center"
                >
                  {item}
                  <button
                    type="button"
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelection(item);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-md text-gray-500">{label}</span>
            )}
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown List */}
        {open && (
          <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {/* Sticky Search */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Options */}
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selected.includes(option)}
                    onChange={() => toggleSelection(option)}
                  />
                  {option}
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
