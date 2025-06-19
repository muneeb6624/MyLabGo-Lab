"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function ClientRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const path = window.location.pathname;
      const isDashboardPath = path.startsWith("/dashboard");

      if (!user && isDashboardPath) {
        // ❌ Not logged in and trying to access dashboard
        router.replace("/login");
      } else if (
        user &&
        (path === "/" || path === "/login" || path === "/register")
      ) {
        // ✅ Logged in but on landing/auth page
        router.replace("/dashboard/profile");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return null;

  return null;
}
