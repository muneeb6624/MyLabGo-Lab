"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const isAuthenticated = () => {
  // Replace with real auth logic
  return true;
};

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/register");
    }
    // Only redirect to dashboard if not already there
    // Remove the else block to avoid infinite redirects
  }, [router]);

  return null;
}
