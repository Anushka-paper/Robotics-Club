"use client";

import React from "react";
import TeamHeader from "./TeamHeader";
import TeamSection from "./TeamSection";
import {
  facultyAdvisors,
  finalYearMembers,
  thirdYearMembers,
  secondYearMembers,
} from "./team-data";
import "./team.css";

/**
 * Drop-in team page section for the Robotics Club, MMMUT site.
 * Usage: import TeamPage from "@/components/team/TeamPage" and
 * render it wherever the team route/section belongs.
 */
export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#0A0C10]">
      <TeamHeader />

      <TeamSection
        title="Faculties"
        members={facultyAdvisors}
        direction="left"
      />
      <TeamSection
        title="Final Year Members"
        members={finalYearMembers}
        direction="right"
      />
      <TeamSection
        title="Third Year Members"
        members={thirdYearMembers}
        direction="left"
      />
      <TeamSection
        title="Second Year Members"
        members={secondYearMembers}
        direction="right"
      />

      <div className="h-10 md:h-16" />
    </main>
  );
}
