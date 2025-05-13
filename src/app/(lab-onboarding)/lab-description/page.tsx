"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function DescriptionPage() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description) {
      setError("Description is required.");
      return;
    }

    setError(""); // Clear any previous error

    // Store the description in localStorage
    console.log("Lab Description:", description);
    localStorage.setItem("labDescription", description);

    // Navigate to the location page
    router.push("/lab-location");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-[#374151] mb-4 text-center">
          Add Your Lab Description
        </h1>
        <p className="text-sm text-[#374151] text-center mb-6">
          Let patients know more about your labs specialties, history, or services.
        </p>

        {error && (
          <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            placeholder="Enter a brief description about your lab..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border border-gray-300 rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
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

export default DescriptionPage;
