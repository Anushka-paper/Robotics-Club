"use client";

import { useState, useEffect } from "react";
import RobotLoader from "@/components/RobotLoader";
import SideNav from "@/components/SideNav";
import LandingPage from "@/routes/Landing/LandingPage";

export default function HomeClient() {
  const [showLoader, setShowLoader] = useState(true); // Always true on first render to match SSR

  useEffect(() => {
    // Run this only on the client after hydration
    if (window.location.search.includes("skip=true") || sessionStorage.getItem("hasSeenLoader")) {
      setShowLoader(false);
      sessionStorage.setItem("hasSeenLoader", "true");
    }
  }, []);

  const handleComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem("hasSeenLoader", "true");
  };

  return (
    <>
      {showLoader && <RobotLoader onComplete={handleComplete} />}
      <SideNav />
      <LandingPage />
    </>
  );
}
