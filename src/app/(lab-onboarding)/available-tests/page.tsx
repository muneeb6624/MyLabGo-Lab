"use client";

import React, { useState } from "react";

function AvailableTestsPage() {
  const [customTests, setCustomTests] = useState<
    { name: string; description: string; price: string; homeSample: string }[]
  >([]);
  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    price: "",
    homeSample: "No",
  });

  const [selectedPredefinedTests, setSelectedPredefinedTests] = useState<
    { name: string; price: string }[]
  >([]);

  const predefinedTests = [
    "Basic Metabolic Panel (BMP)",
    "Comprehensive Metabolic Panel (CMP)",
    "Lipid Profile",
    "Thyroid Test(s)",
    "Complete Blood Count (CBC) with or without White Blood Cell (WBC) Differential",
    "Prothrombin Time (PT) with INR & Activated Partial Thromboplastin Time (PTT)",
    "Urinalysis (UA)",
  ];

  const handlePredefinedTestChange = (testName: string, checked: boolean) => {
    if (checked) {
      setSelectedPredefinedTests([
        ...selectedPredefinedTests,
        { name: testName, price: "" },
      ]);
    } else {
      setSelectedPredefinedTests(
        selectedPredefinedTests.filter((test) => test.name !== testName)
      );
    }
  };

  const handlePredefinedTestPriceChange = (testName: string, price: string) => {
    setSelectedPredefinedTests(
      selectedPredefinedTests.map((test) =>
        test.name === testName ? { ...test, price } : test
      )
    );
  };

  const handleAddCustomTest = () => {
    if (!newTest.name || !newTest.description || !newTest.price) {
      alert("Please fill in all fields for the custom test.");
      return;
    }

    setCustomTests([...customTests, newTest]);
    setNewTest({ name: "", description: "", price: "", homeSample: "No" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-3xl">
        <h1 className="text-2xl font-bold text-[#374151] mb-6 text-center">
          Select Offered Tests
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-4">
            Predefined Tests
          </h2>
          <ul className="space-y-4">
            {predefinedTests.map((test, index) => (
              <li key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`test-${index}`}
                    className="w-4 h-4 text-[#3FA65C] border-gray-300 rounded focus:ring-[#3FA65C]"
                    onChange={(e) =>
                      handlePredefinedTestChange(test, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`test-${index}`}
                    className="text-[#374151] text-sm"
                  >
                    {test}
                  </label>
                </div>
                {selectedPredefinedTests.some(
                  (selectedTest) => selectedTest.name === test
                ) && (
                  <input
                    type="text"
                    placeholder="Price"
                    value={
                      selectedPredefinedTests.find(
                        (selectedTest) => selectedTest.name === test
                      )?.price || ""
                    }
                    onChange={(e) =>
                      handlePredefinedTestPriceChange(test, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-4">
            Add Custom Test
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Test Name"
              value={newTest.name}
              onChange={(e) =>
                setNewTest({ ...newTest, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
            />
            <textarea
              placeholder="Test Description"
              value={newTest.description}
              onChange={(e) =>
                setNewTest({ ...newTest, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
            />
            <input
              type="text"
              placeholder="Price"
              value={newTest.price}
              onChange={(e) =>
                setNewTest({ ...newTest, price: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
            />
            <select
              value={newTest.homeSample}
              onChange={(e) =>
                setNewTest({ ...newTest, homeSample: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
            >
              <option value="No">Can it be done by only blood sample from home? No</option>
              <option value="Yes">Yes</option>
            </select>
            <button
              onClick={handleAddCustomTest}
              className="w-full bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
            >
              Add Test
            </button>
          </div>
        </div>

        {customTests.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">
              Custom Tests
            </h2>
            <ul className="space-y-4">
              {customTests.map((test, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-300 rounded bg-gray-50"
                >
                  <h3 className="font-bold text-[#374151]">{test.name}</h3>
                  <p className="text-sm text-[#374151]">{test.description}</p>
                  <p className="text-sm text-[#374151]">
                    Price: ${test.price}
                  </p>
                  <p className="text-sm text-[#374151]">
                    Home Sample: {test.homeSample}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="w-full bg-[#00ACC1] text-white py-2 px-4 rounded hover:bg-[#008b9a] transition duration-200 mt-6"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
}

export default AvailableTestsPage;
