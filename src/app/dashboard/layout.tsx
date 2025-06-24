"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import LabAvailabilityToggle from "../../components/buttons/LabAvailabilityToggle/LabAvailabilityToggle"; // adjust path if needed

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("labDocId");
    auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1]">
        <div className="animate-bounce text-4xl font-extrabold text-white mb-2 tracking-widest">
          MyLabGo
        </div>
        <div className="text-lg text-white opacity-80">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // while redirecting

  const navItems = [
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: "Reports", href: "/dashboard/reports" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#00ACC1]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#374151] text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-center border-b border-gray-600">
          Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block w-full text-left py-2 px-4 rounded transition duration-200 ${
                    pathname === item.href
                      ? "bg-[#3FA65C] font-semibold"
                      : "hover:bg-[#3FA65C]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#374151]">MyLabGo Admin</h1>
          <div className="flex items-center space-x-4">
            <RxAvatar size={24} className="text-gray-600" />
            <div className="flex items-center space-x-6">
              <LabAvailabilityToggle />
              <RxAvatar size={24} className="text-gray-600" />
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-[#F57F17] text-white rounded hover:bg-[#d66b0f] transition duration-200"
              >
                Logout
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-[#F57F17] text-white rounded hover:bg-[#d66b0f] transition duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
