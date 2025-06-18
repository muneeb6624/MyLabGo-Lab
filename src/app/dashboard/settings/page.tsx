'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../../../../lib/firebase';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';

interface LabData {
  labName?: string;
  labDescription?: string;
  imgUrl?: string;
  tests?: string[];
  // Add other fields as needed
}

function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [labData, setLabData] = useState<LabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [labName, setLabName] = useState('');
  const [labDescription, setLabDescription] = useState('');
  const [labImageUrl, setLabImageUrl] = useState('');
  const [newTest, setNewTest] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLabData = async () => {
      const labId = localStorage.getItem('labDocId');
      if (!labId) return;

      try {
        const db = getFirestore(app);
        const docRef = doc(db, 'LabData', labId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLabData(data);
          setLabName(data.labName || '');
          setLabDescription(data.labDescription || '');
          setLabImageUrl(data.imgUrl || '');
        }
      } catch (err) {
        console.error('Error fetching lab data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, []);

  const handleSave = async () => {
    const labId = localStorage.getItem('labDocId');
    if (!labId) return;

    try {
      const db = getFirestore(app);
      const docRef = doc(db, 'LabData', labId);
      await updateDoc(docRef, {
        labName,
        labDescription,
        imgUrl: labImageUrl,
      });
      setMessage('Changes saved successfully ✅');
    } catch (err) {
      console.error('Error updating lab data:', err);
      setMessage('Failed to save changes ❌');
    }
  };

  const handleAddTest = async () => {
    const labId = localStorage.getItem('labDocId');
    if (!labId || !newTest.trim()) return;

    try {
      const db = getFirestore(app);
      const docRef = doc(db, 'LabData', labId);
      await updateDoc(docRef, {
        tests: arrayUnion(newTest.trim()),
      });
      setNewTest('');
      setMessage('Test added ✅');
    } catch (err) {
      console.error('Error adding test:', err);
      setMessage('Failed to add test ❌');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading settings...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#374151] mb-4">Lab Settings</h1>

        {message && (
          <div className="text-sm text-green-700 mb-4 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Lab Image</label>
          <div className="flex items-center space-x-4">
            <Image
              src={labImageUrl || '/lab-image.jpg'}
              alt="Lab"
              width={80}
              height={80}
              className="rounded object-cover"
            />
            <CldUploadWidget
              uploadPreset="lab_upload_preset"
              onSuccess={(results: CloudinaryUploadWidgetResults) => {
                if (typeof results.info === 'object' && results.info?.secure_url) {
                  setLabImageUrl(results.info.secure_url);
                }
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  type="button"
                >
                  Change Image
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Lab Name</label>
          <input
            type="text"
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Lab Description</label>
          <textarea
            value={labDescription}
            onChange={(e) => setLabDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
            rows={3}
          />
        </div>

        {/* Add Test */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Add a Test</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTest}
              onChange={(e) => setNewTest(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
              placeholder="Enter test name"
            />
            <button
              onClick={handleAddTest}
              type="button"
              className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a]"
            >
              Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 bg-[#3FA65C] text-white py-2 px-6 rounded hover:bg-[#2e8c4a] transition duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Page;
