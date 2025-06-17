"use client";

import { useState } from "react";
import { db } from "../../../lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";

const LabRegistration = () => {
  const [labName, setLabname] = useState("");
  const [userName, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!labName || !location || !description) {
      setStatus("Please fill all fields.");
      return;
    }

    try {
      const labId = labName.replace(/\s+/g, "_").toLowerCase(); // You can customize ID generation
      await setDoc(doc(db, "LabData", labId), {
        labName,
        userName,
        description
      });
      setStatus("✅ Lab registered successfully!");
      setLabname("");
      setLocation("");
      setDescription("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(`❌ Error: ${error.message}`);
      } else {
        setStatus("❌ An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Register Your Lab</h1>

      <input
        type="text"
        placeholder="Lab Name"
        value={labName}
        onChange={(e) => setLabname(e.target.value)}
        className="mb-4 p-2 w-full max-w-md border rounded"
      />

      <input
        type="text"
        placeholder="Location"
        value={userName}
        onChange={(e) => setLocation(e.target.value)}
        className="mb-4 p-2 w-full max-w-md border rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 p-2 w-full max-w-md border rounded h-24"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default LabRegistration;
