"use client";

import { useState } from "react";
import RobotLoader from "@/components/RobotLoader";
import SideNav from "@/components/SideNav";
import LandingPage from "@/routes/Landing/LandingPage";

export default function HomeClient() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {showLoader && <RobotLoader onComplete={() => setShowLoader(false)} />}
      <SideNav />
      <LandingPage />
    </>
  );
}
