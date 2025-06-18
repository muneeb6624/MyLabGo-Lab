'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, app } from '../../../../lib/firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';

function Page() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [labname, setLabName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [labImageUrl, setLabImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const db = getFirestore(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !labname || !labImageUrl) {
      setError('All fields including lab image are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: username,
        photoURL: labImageUrl,
      });

      // Store Lab data and get the document reference
      const labDocRef = await addDoc(collection(db, 'LabData'), {
        email,
        imgUrl: labImageUrl,
        labName: labname,
        userName: username,
      });

      // 🔥 Save the document ID to localStorage for later use
      localStorage.setItem("labDocId", labDocRef.id);

      console.log('User registered and lab data stored.');
      router.push('/lab-description');
    } catch (err: unknown) {
      console.error('Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-[#374151] mb-4 text-center">
          Register
        </h1>
        <p className="text-sm text-[#374151] text-center mb-6">
          Kindly fill in the details to create an account
        </p>
        {error && (
          <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username (It should be unique)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
          <input
            type="text"
            placeholder="Laboratory Name"
            value={labname}
            onChange={(e) => setLabName(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />

          <div className="text-center">
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
                  type="button"
                  onClick={() => open()}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  {labImageUrl ? 'Change Image' : 'Upload Image'}
                </button>
              )}
            </CldUploadWidget>
            {labImageUrl && (
              <div className="mt-4">
                <Image
                  src={labImageUrl}
                  alt="Lab"
                  width={100}
                  height={100}
                  className="rounded object-cover mx-auto"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-[#374151] text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-[#3FA65C]">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Page;
