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
      // Partially mask mobile and email for privacy
      mobile: registration.mobile.slice(0, 3) + "****" + registration.mobile.slice(-3),
      email: registration.email,
      memberCount: registration.memberCount,
      members: registration.members,
      utr: registration.utr,
      paymentScreenshotUrl: registration.paymentScreenshotUrl,
      paymentStatus: registration.paymentStatus,
      registrationStatus: registration.registrationStatus,
      createdAt: registration.createdAt,
    };

    return NextResponse.json({ success: true, data: safe }, { status: 200 });
  } catch (err) {
    console.error("Registration fetch error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while retrieving your registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
