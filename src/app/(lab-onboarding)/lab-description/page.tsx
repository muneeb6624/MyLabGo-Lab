"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { app } from "../../../../lib/firebase";

function DescriptionPage() {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = getFirestore(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description) {
      setError("Description is required.");
      return;
    }

    setError(""); // Clear any previous error

    // Get the Lab document ID from localStorage
    const labDocId = localStorage.getItem("labDocId");
    if (!labDocId) {
      setError("Lab registration not found. Please register again.");
      return;
    }

    setLoading(true);
    try {
      // Update the description in the existing LabData document
      await updateDoc(doc(db, "LabData", labDocId), {
        description,
      });

      // Optionally, store the description in localStorage
      localStorage.setItem("labDescription", description);

      // Navigate to the location page
      router.push("/lab-location");
    } catch (err: unknown) {
      console.error("Error updating description:", err);
      setError("Failed to save description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#3FA65C] mb-4 text-center">
          Lab Description
        </h1>
        <p className="text-sm text-[#374151] text-center mb-6">
          Let patients know more about your lab specialties, history, or services.
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
            disabled={loading}
            className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DescriptionPage;
