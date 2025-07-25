import React from "react";

const GuideAvailabilitySection = ({ availability = [] }) => (
  <div className="bg-white rounded-2xl px-0 py-0 md:py-0 md:px-0 w-full max-w-xs mx-auto md:mx-0 shadow-sm border border-gray-100">
    <table className="w-full text-sm overflow-hidden rounded-2xl">
      <thead>
        <tr>
          <th className="text-left text-gray-500 font-medium py-3 px-6 bg-white rounded-t-2xl">Day</th>
          <th className="text-right text-gray-500 font-medium py-3 px-6 bg-white rounded-t-2xl">Status</th>
        </tr>
      </thead>
      <tbody>
        {availability.map((day, idx) => (
          <tr
            key={day.day}
            className={
              `${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${idx !== availability.length - 1 ? 'border-b border-gray-100' : ''}`
            }
          >
            <td className="py-4 px-6 text-gray-800 font-medium first:rounded-bl-2xl last:rounded-tl-2xl">
              {day.day}
            </td>
            <td className="py-4 px-6 text-right first:rounded-br-2xl last:rounded-tr-2xl">
              {day.available ? (
                <span className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold">
                  {day.time}
                </span>
              ) : (
                <span className="inline-block bg-red-50 text-red-500 px-3 py-1 rounded-full font-semibold">
                  Not available
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default GuideAvailabilitySection; 