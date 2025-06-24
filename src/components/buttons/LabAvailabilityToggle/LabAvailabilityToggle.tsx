"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../../lib/firebase"; // ✅ Update if your firebase config is elsewhere

// Optional: avoid re-initialization
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const LabAvailabilityToggle = () => {
  const [labId, setLabId] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLabId = localStorage.getItem("labDocId");
    if (storedLabId) {
      setLabId(storedLabId);
      const statusRef = ref(db, `OnlineStatus/${storedLabId}`);

      // Sync current status from DB
      onValue(statusRef, (snapshot) => {
        const val = snapshot.val();
        setIsAvailable(val === true);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const toggleAvailability = () => {
    if (!labId) return;
    const statusRef = ref(db, `OnlineStatus/${labId}`);
    set(statusRef, !isAvailable);
  };

  if (loading || !labId) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-gray-700">Available:</span>
      <button
        onClick={toggleAvailability}
        className={`py-1 px-3 rounded text-sm font-medium transition duration-200 ${
          isAvailable
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {isAvailable ? "Yes" : "No"}
      </button>
    </div>
  );
};

export default LabAvailabilityToggle;
