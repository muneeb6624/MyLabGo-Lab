"use client";

import React, { useState } from "react";

interface Order {
  id: number;
  testName: string;
  patientName: string;
  status: "in process" | "approved" | "completed" | "dismissed";
}

const ordersData: Order[] = [
  { id: 1, testName: "Blood Test", patientName: "John Doe", status: "in process" },
  { id: 2, testName: "X-Ray", patientName: "Jane Smith", status: "approved" },
  { id: 3, testName: "MRI", patientName: "Alice Johnson", status: "in process" },
];

function OrdersPage() {
  const [filter, setFilter] = useState<"all" | "in process" | "approved" | "completed">("all");
  const [orders, setOrders] = useState<Order[]>(ordersData);

  const handleApprove = (id: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "approved" } : order
      )
    );
  };

  const handleDismiss = (id: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "dismissed" } : order
      )
    );
  };

  const handleMarkDone = (id: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "completed" } : order
      )
    );
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#00ACC1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-[#374151] mb-6 text-center">
          Orders Dashboard
        </h1>
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => setFilter("all")}
              className={`py-2 px-4 rounded ${
                filter === "all"
                  ? "bg-[#3FA65C] text-white"
                  : "bg-gray-200 text-[#374151]"
              } transition duration-200`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("in process")}
              className={`ml-2 py-2 px-4 rounded ${
                filter === "in process"
                  ? "bg-[#3FA65C] text-white"
                  : "bg-gray-200 text-[#374151]"
              } transition duration-200`}
            >
              In Process
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`ml-2 py-2 px-4 rounded ${
                filter === "approved"
                  ? "bg-[#3FA65C] text-white"
                  : "bg-gray-200 text-[#374151]"
              } transition duration-200`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`ml-2 py-2 px-4 rounded ${
                filter === "completed"
                  ? "bg-[#3FA65C] text-white"
                  : "bg-gray-200 text-[#374151]"
              } transition duration-200`}
            >
              Completed
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Test Name</th>
              <th className="border border-gray-300 p-3 text-left">Patient Name</th>
              <th className="border border-gray-300 p-3 text-left">Status</th>
              <th className="border border-gray-300 p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-3">{order.testName}</td>
                <td className="border border-gray-300 p-3">{order.patientName}</td>
                <td className="border border-gray-300 p-3 capitalize">
                  {order.status}
                </td>
                <td className="border border-gray-300 p-3">
                  {order.status === "in process" && (
                    <>
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="bg-[#3FA65C] text-white py-1 px-3 rounded hover:bg-[#2e8c4a] transition duration-200 mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDismiss(order.id)}
                        className="bg-[#F57F17] text-white py-1 px-3 rounded hover:bg-[#d66b0f] transition duration-200"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {order.status === "approved" && (
                    <button
                      onClick={() => handleMarkDone(order.id)}
                      className="bg-[#3FA65C] text-white py-1 px-3 rounded hover:bg-[#2e8c4a] transition duration-200"
                    >
                      Mark Done
                    </button>
                  )}
                  {order.status === "completed" && (
                    <button
                      className="bg-[#007BFF] text-white py-1 px-3 rounded hover:bg-[#0056b3] transition duration-200"
                    >
                      Upload Report
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <p className="text-center text-[#374151] mt-4">
            No orders to display.
          </p>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;