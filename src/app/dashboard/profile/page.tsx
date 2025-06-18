'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../../lib/firebase';

interface LabDetails {
  imgUrl?: string;
  labName?: string;
  description?: string;
  userName?: string;
  email?: string;
  // Add other fields as needed based on your Firestore data
}

function Page() {
  const [labDetails, setLabDetails] = useState<LabDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabDetails = async () => {
      const labId = localStorage.getItem('labDocId');
      if (!labId) return;

      try {
        const db = getFirestore(app);
        const docRef = doc(db, 'LabData', labId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLabDetails(docSnap.data());
        }
      } catch (err) {
        console.error('Error fetching lab details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabDetails();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading profile...</div>
    );
  }

  if (!labDetails) {
    return (
      <div className="p-6 text-center text-red-600">Lab details not found.</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Lab Header */}
      <div>
        <Image
          src={labDetails?.imgUrl || '/lab-image.jpg'}
          alt="Lab"
          width={128}
          height={128}
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#374151]">
            {labDetails?.labName}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {labDetails?.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <Image
            src={labDetails?.imgUrl || '/avatar.jpg'}
            alt="Avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-[#374151]">
              {labDetails?.userName || 'Lab Owner'}
            </h2>
            <p className="text-sm text-gray-600">Admin of the lab</p>
            <p className="text-sm text-gray-600">{labDetails?.email}</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">In Progress</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">0</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">Total Tests</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">0</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">Ratings</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">4.8 ⭐</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-[#374151]">Pending Tests</h3>
          <p className="text-2xl font-bold text-[#3FA65C]">0</p>
        </div>
      </div>
    </div>
  );
}

export default Page;
