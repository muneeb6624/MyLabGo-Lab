"use client";

import React from 'react';
import { useState } from 'react';

function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    // Add your authentication logic here
    console.log('Form submitted:', { username, password });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {/* <img
          src="/logo.png"
          alt="Logo"
          className="w-24 h-24 mx-auto mb-4"
        /> */}
        <h1 className="text-xl font-bold text-[#374151] mb-4 text-center">Welcome to Lab Management System</h1>

        <h1 className="text-3xl font-bold text-[#374151] mb-4 text-center">Login</h1>
        <p className="text-sm text-[#374151] text-center mb-6">
          Kindly enter your login credentials
        </p>
        {error && (
          <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
          />
          <button
            type="submit"
            className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-[#374151] text-center mt-4 mr-0.5"> Do not have an account?  
          <a href="/register" className="text-[#3FA65C] font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Page;
