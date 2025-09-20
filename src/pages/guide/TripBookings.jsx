import React from "react";

const mockBookings = [
  {
    id: 1,
    customer: "John Doe",
    date: "2024-06-10",
    location: "Horton Plains",
    status: "Confirmed",
  },
  {
    id: 2,
    customer: "Jane Smith",
    date: "2024-06-12",
    location: "Riverston Peak",
    status: "Pending",
  },
  {
    id: 3,
    customer: "Alex Lee",
    date: "2024-06-15",
    location: "Wewathenna Mountain",
    status: "Confirmed",
  },
  {
    id: 4,
    customer: "Sara Kim",
    date: "2024-06-18",
    location: "Knuckles Range",
    status: "Pending",
  },
];

const statusStyles = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function TripBookings() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Trip Bookings
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Customer Name
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Date
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Location
              </th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((b) => (
              <tr key={b.id} className="border-b last:border-0">
                <td className="px-4 py-2">{b.customer}</td>
                <td className="px-4 py-2">{b.date}</td>
                <td className="px-4 py-2">{b.location}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      statusStyles[b.status]
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
