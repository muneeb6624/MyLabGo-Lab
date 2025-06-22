"use client";

import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../../lib/firebase";

function AvailableTestsPage() {
  const db = getFirestore(app);

  // Types
  interface TestInput {
    name: string;
    description: string;
    price: string;
    homeSample: string;
    estimatedTime?: number;
  }

  const [customTests, setCustomTests] = useState<TestInput[]>([]);
  const [newTest, setNewTest] = useState<TestInput>({
    name: "",
    description: "",
    price: "",
    homeSample: "No",
    estimatedTime: undefined,
  });

  const [selectedPredefinedTests, setSelectedPredefinedTests] = useState<
    TestInput[]
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
        {
          name: testName,
          price: "",
          homeSample: "No",
          estimatedTime: undefined,
          description: "",
        },
      ]);
    } else {
      setSelectedPredefinedTests(
        selectedPredefinedTests.filter((test) => test.name !== testName)
      );
    }
  };

  const handlePredefinedTestFieldChange = (
    testName: string,
    field: keyof TestInput,
    value: string
  ) => {
    setSelectedPredefinedTests((prevTests) =>
      prevTests.map((test) =>
        test.name === testName
          ? {
              ...test,
              [field]:
                field === "estimatedTime"
                  ? value === ""
                    ? undefined
                    : parseInt(value, 10)
                  : value,
            }
          : test
      )
    );
  };

  const handleAddCustomTest = () => {
    if (!newTest.name || !newTest.description || !newTest.price) {
      alert("Please fill in all fields for the custom test.");
      return;
    }

    setCustomTests([...customTests, newTest]);
    setNewTest({ name: "", description: "", price: "", homeSample: "No", estimatedTime: undefined });
  };

  const saveTestsToFirebase = async () => {
    const labId = localStorage.getItem("labDocId");
    if (!labId) {
      alert("Lab ID not found. Please register again.");
      return;
    }

    const allTests = [...selectedPredefinedTests, ...customTests];

    try {
      for (const test of allTests) {
        await addDoc(collection(db, "LabData", labId, "Tests"), {
          testName: test.name,
          description: test.description,
          price: parseFloat(test.price),
          homeOrder: test.homeSample === "Yes",
          estimatedTime: typeof test.estimatedTime === "number" ? test.estimatedTime : null,
        });
      }

      alert("Tests saved successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error saving tests:", err);
      alert("Something went wrong while saving tests.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-3xl">
        <h1 className="text-2xl font-bold text-[#374151] mb-6 text-center">
          Select Offered Tests
        </h1>

        {/* Predefined Tests */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-4">
            Predefined Tests
          </h2>
          <ul className="space-y-4">
            {predefinedTests.map((test, index) => {
              const selectedTest = selectedPredefinedTests.find(
                (t) => t.name === test
              );
              return (
                <li key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`test-${index}`}
                      className="w-4 h-4 text-[#3FA65C] border-gray-300 rounded focus:ring-[#3FA65C]"
                      checked={!!selectedTest}
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
                  {selectedTest && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Price"
                        value={selectedTest.price}
                        onChange={(e) =>
                          handlePredefinedTestFieldChange(
                            test,
                            "price",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
                      />
                      <input
                        type="text"
                        placeholder="Write description of the test / NA"
                        value={selectedTest.description}
                        onChange={(e) =>
                          handlePredefinedTestFieldChange(
                            test,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
                      />
                      <select
                        value={selectedTest.homeSample}
                        onChange={(e) =>
                          handlePredefinedTestFieldChange(
                            test,
                            "homeSample",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
                      >
                        <option value="No">Can this be done from home? No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        placeholder="Estimated time (hours, e.g., 24)"
                        value={
                          selectedTest.estimatedTime !== undefined
                            ? selectedTest.estimatedTime
                            : ""
                        }
                        onChange={(e) =>
                          handlePredefinedTestFieldChange(
                            test,
                            "estimatedTime",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Custom Test Section */}
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
            <input
              type="number"
              min="0"
              placeholder="Estimated time (hours, e.g., 24)"
              value={newTest.estimatedTime !== undefined ? newTest.estimatedTime : ""}
              onChange={(e) =>
                setNewTest({
                  ...newTest,
                  estimatedTime: e.target.value === "" ? undefined : parseInt(e.target.value, 10),
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA65C]"
            />
            <button
              onClick={handleAddCustomTest}
              className="w-full bg-[#3FA65C] text-white py-2 px-4 rounded hover:bg-[#2e8c4a] transition duration-200"
            >
              Add Test
            </button>
          </div>
        </div>

        {/* Custom Tests Preview */}
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
                  <p className="text-sm text-[#374151]">Price: ${test.price}</p>
                  <p className="text-sm text-[#374151]">Home Sample: {test.homeSample}</p>
                  <p className="text-sm text-[#374151]">
                    Estimated Time:{" "}
                    {typeof test.estimatedTime === "number"
                      ? `${test.estimatedTime} hrs`
                      : "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveTestsToFirebase}
          className="w-full bg-[#00ACC1] text-white py-2 px-4 rounded hover:bg-[#008b9a] transition duration-200 mt-6 hover:cursor-pointer"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
}

export default AvailableTestsPage;
