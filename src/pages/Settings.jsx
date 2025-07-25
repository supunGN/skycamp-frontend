import React from "react";
import Navbar from "../components/organisms/Navbar";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, {user?.first_name}! (Settings)
        </h1>
        <p className="text-gray-600 mt-2">This is your settings page.</p>
      </div>
    </>
  );
}
