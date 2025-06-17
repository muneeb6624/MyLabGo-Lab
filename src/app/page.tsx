"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.push("/login");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return showSplash ? (
    <div className="flex flex-col items-center justify-center h-screen bg-[#00ACC1] text-white transition-opacity duration-500">
      <h1 className="text-5xl font-bold mb-4 animate-bounce">MyLabGo!</h1>
      <p className="text-xl text-center animate-pulse">Manage your lab with ease and clarity...</p>
    </div>
  ) : null;
}
