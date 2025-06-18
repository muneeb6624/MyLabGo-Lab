"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../lib/firebase";

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store in localStorage if needed
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("uid", user.uid);

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Login failed.");
      } else {
        setError("Login failed.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-[#374151] mb-4 text-center">Login</h1>
        <p className="text-sm text-[#374151] text-center mb-6">Enter your credentials</p>
        {error && <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#3FA65C]" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#3FA65C]" />
          <button type="submit" className="bg-[#3FA65C] text-white py-2 rounded hover:bg-[#2e8c4a]">
            Login
          </button>
        </form>
        <p className="text-sm text-[#374151] text-center mt-4">
          Don’t have an account? <a href="/register" className="text-[#3FA65C]">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Page;
