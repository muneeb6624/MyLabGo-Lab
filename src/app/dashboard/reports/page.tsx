"use client";

import React, { useState } from "react";

const patients = [
  { id: 1, name: "John Doe", report: "Blood_Test_Report.pdf" },
  { id: 2, name: "Jane Smith", report: "X-Ray_Report.pdf" },
  { id: 3, name: "Alice Johnson", report: "MRI_Report.pdf" },
];

function ReportsPage() {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen bg-[#00ACC1]">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-[#374151] mb-4">Patients</h2>
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <ul className="space-y-2">
          {patients.map((patient) => (
            <li
              key={patient.id}
              onClick={() => setSelectedPatient(patient.id)}
              className={`p-2 rounded cursor-pointer ${
                selectedPatient === patient.id
                  ? "bg-[#3FA65C] text-white"
                  : "bg-gray-100 text-[#374151]"
              } hover:bg-[#3FA65C] hover:text-white transition duration-200`}
            >
              {patient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8 rounded-lg shadow-lg ml-4">
        <h1 className="text-3xl font-bold text-[#374151] mb-6 text-center">
          Reports Dashboard
        </h1>
        {selectedPatient ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#374151] mb-4">
              Report for {patients.find((p) => p.id === selectedPatient)?.name}
            </h2>
            <button
              onClick={() =>
                alert(
                  `Downloading ${
                    patients.find((p) => p.id === selectedPatient)?.report
                  }`
                )
              }
              className="bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
            >
              Download Report
            </button>
          </div>
        ) : (
          <p className="text-center text-[#374151]">
            Select a patient to view their report.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
