"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const isAuthenticated = () => {
  // Replace with real auth logic
  return false;
};

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/register");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return null;
}
