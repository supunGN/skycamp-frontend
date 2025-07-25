import React from "react";

export default function DashboardContent({ children }) {
  return (
    <main className="flex-1 w-full h-full overflow-y-auto bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">{children}</div>
    </main>
  );
}
