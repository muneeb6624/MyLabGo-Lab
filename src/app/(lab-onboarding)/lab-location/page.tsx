"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location) {
      setError("Location is required.");
      return;
    }

    setError(""); // Clear any previous error

    // For now, store it in localStorage and log it
    console.log("Lab Location:", location);
    localStorage.setItem("labLocation", location);

    // Redirect to the next page
    router.push("/available-tests");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-[#374151] mb-4 text-center">
          Add Your Lab Location
        </h1>
        <p className="text-sm text-[#374151] text-center mb-6">
          Provide your labs location to help patients find you.
        </p>

        {error && (
          <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter your lab's location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />

          <button
            type="submit"
            className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default LocationPage;
