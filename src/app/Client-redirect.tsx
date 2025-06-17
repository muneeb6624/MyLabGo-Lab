"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Adjust path if needed

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
      // If not authenticated, do nothing (stay on current page)
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
