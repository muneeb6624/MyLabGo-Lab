"use client";

import React, { useState } from 'react';

function Page() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [labname, setLabName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    // Add your registration logic here
    console.log('Form submitted:', { username, email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* <img
          src="/logo.png"
          alt="Logo"
          className="w-24 h-24 mx-auto mb-4"
        /> */}
        <h1 className="text-3xl font-bold text-[#374151] mb-4 text-center">Welcome to Lab Management System</h1>

        <h1 className="text-3xl font-bold text-[#374151] mb-4 text-center">Register</h1>
        <p className="text-sm text-[#374151] text-center mb-6">
          Kindly fill in the details to create an account
        </p>
        {error && (
          <div className="text-sm text-[#F57F17] mb-4 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="username (It should be unique)"
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
          <button
            type="submit"
            className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-[#374151] text-center mt-4">
          Already have an account? <a href="/login" className="text-[#3FA65C]">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Page;
