import React from "react";

// Simple Calendar component (controlled, reusable, left-aligned)
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ value, onChange }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Parse selected date
  const selectedDay = value ? new Date(value).getDate() : null;

  const handleDateClick = (date) => {
    const selected = new Date(year, month, date);
    if (onChange)
      onChange(
        selected.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full text-left">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">
          {today.toLocaleString("default", { month: "long" })} {year}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {days.map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-500">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={"empty-" + i} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const isSelected = selectedDay === date;
          return (
            <button
              key={date}
              onClick={() => handleDateClick(date)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${
                  isSelected
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-cyan-100 text-gray-800"
                }`}
            >
              {date}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
