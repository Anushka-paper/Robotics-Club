import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRegistration } from "@/lib/auth";
import { getRegistrationByRegistrationId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  try {
    const { registrationId } = await params;

    if (!registrationId || typeof registrationId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid registration ID." },
        { status: 400 }
      );
    }

    const authenticatedRegistration = await getAuthenticatedRegistration();

    if (!authenticatedRegistration) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    if (authenticatedRegistration.registrationId !== registrationId.toUpperCase()) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to access this dashboard." },
        { status: 403 }
      );
    }

    // Basic format check to avoid unnecessary DB queries
    if (!/^EMBX-\d{4}-[A-F0-9]{4}$/i.test(registrationId)) {
      return NextResponse.json(
        { success: false, error: "Registration not found." },
        { status: 404 }
      );
    }

    const registration = await getRegistrationByRegistrationId(registrationId.toUpperCase());

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found." },
        { status: 404 }
      );
    }

    // Return data with sensitive fields excluded / masked
    const safe = {
      registrationId: registration.registrationId,
      teamName: registration.teamName,
      leaderName: registration.leaderName,
      leaderRollNumber: registration.leaderRollNumber,
      leaderBranch: registration.leaderBranch,
      leaderYear: registration.leaderYear,
      // Return raw mobile so the user can edit it without overwriting with asterisks
      mobile: registration.mobile,
      email: registration.email,
      memberCount: registration.memberCount,
      members: registration.members,
      utr: registration.utr,
      paymentScreenshotUrl: registration.paymentScreenshotUrl,
      paymentStatus: registration.paymentStatus,
      registrationStatus: registration.registrationStatus,
      createdAt: registration.createdAt,
    };

    const { SystemSettings } = await import("@/lib/db");
    const setting = await SystemSettings.findOne({ key: "allowParticipantEdits" });
    const allowParticipantEdits = setting ? setting.value !== false : true;

    return NextResponse.json({ success: true, data: safe, allowParticipantEdits }, { status: 200 });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while retrieving your registration. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  try {
    const { registrationId } = await params;

    if (!registrationId || typeof registrationId !== "string") {
      return NextResponse.json({ success: false, error: "Invalid registration ID." }, { status: 400 });
    }

    const authenticatedRegistration = await getAuthenticatedRegistration();

    if (!authenticatedRegistration || authenticatedRegistration.registrationId !== registrationId.toUpperCase()) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const body = await request.json();
    const { leaderName, leaderRollNumber, leaderBranch, leaderYear, mobile, email, members } = body;

    // Optional: add zod validation here if needed, or rely on client-side + mongoose validation
    const { updateRegistrationDetails, getRegistrationByRegistrationId, SystemSettings } = await import("@/lib/db");

    const setting = await SystemSettings.findOne({ key: "allowParticipantEdits" });
    if (setting && setting.value === false) {
      return NextResponse.json({ success: false, error: "Edits are currently locked by the administrator." }, { status: 403 });
    }
    
    const oldReg = await getRegistrationByRegistrationId(registrationId.toUpperCase());
    let changesText = "Updated details.";
    if (oldReg) {
      const diffs = [];
      if (oldReg.leaderName !== leaderName) diffs.push(`Leader Name ("${oldReg.leaderName}" -> "${leaderName}")`);
      if (oldReg.leaderRollNumber !== leaderRollNumber) diffs.push(`Leader Roll ("${oldReg.leaderRollNumber}" -> "${leaderRollNumber}")`);
      if (oldReg.leaderBranch !== leaderBranch) diffs.push(`Leader Branch ("${oldReg.leaderBranch}" -> "${leaderBranch}")`);
      if (oldReg.leaderYear !== leaderYear) diffs.push(`Leader Year ("${oldReg.leaderYear}" -> "${leaderYear}")`);
      if (oldReg.mobile !== mobile) diffs.push(`Mobile ("${oldReg.mobile}" -> "${mobile}")`);
      if (oldReg.email !== email) diffs.push(`Email ("${oldReg.email}" -> "${email}")`);
      
      if (JSON.stringify(oldReg.members) !== JSON.stringify(members)) {
        diffs.push(`Team Members updated`);
      }
      
      if (diffs.length > 0) {
        changesText = `Updated: ${diffs.join(", ")}`;
      }
    }

    const updated = await updateRegistrationDetails(
      registrationId.toUpperCase(),
      {
        leaderName,
        leaderRollNumber,
        leaderBranch,
        leaderYear,
        mobile,
        email,
        members,
      },
      { editedBy: "TEAM (USER)", changes: changesText }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    console.error("Registration update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
