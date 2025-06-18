"use client";

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const DashboardHome = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome to the Lab Dashboard 👋
      </h2>
      <p className="text-gray-600">
        Use the sidebar to navigate through reports, orders, settings, and your lab profile.
      </p>
    </div>
  );
};

export default DashboardHome;
