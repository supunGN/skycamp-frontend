import React from "react";

// Simple Calendar component (controlled, reusable, left-aligned)
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ value, onChange, minDate, maxDate }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Parse selected date
  const selectedDay = value ? new Date(value).getDate() : null;

  // Helper function to check if a date is disabled
  const isDateDisabled = (date) => {
    const currentDate = new Date(year, month, date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // Disable past dates (before today)
    if (currentDate < todayDate) {
      return true;
    }

    // Disable dates before minDate
    if (minDate) {
      const minDateObj = new Date(minDate);
      minDateObj.setHours(0, 0, 0, 0);
      if (currentDate < minDateObj) {
        return true;
      }
    }

    // Disable dates after maxDate
    if (maxDate) {
      const maxDateObj = new Date(maxDate);
      maxDateObj.setHours(0, 0, 0, 0);
      if (currentDate > maxDateObj) {
        return true;
      }
    }

    return false;
  };

  const handleDateClick = (date) => {
    // Don't allow selection of disabled dates
    if (isDateDisabled(date)) {
      return;
    }

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
          const isDisabled = isDateDisabled(date);
          return (
            <button
              key={date}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${
                  isDisabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-cyan-100 text-gray-800 cursor-pointer"
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
