import { NextRequest, NextResponse } from "next/server";
import {
  getAllRegistrations,
  getRegistrationStats,
  updateRegistrationStatus,
} from "@/lib/db";
import { sendStatusUpdateEmail } from "@/lib/email";
import { isAuthorized, isSuperAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";
    const query = searchParams.get("query") || "";

    const [registrations, stats] = await Promise.all([
      getAllRegistrations({ status, query }),
      getRegistrationStats(),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      data: registrations,
    });
  } catch (err) {
    console.error("Fetch registrations error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load registrations." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Read-only access. Super admin required to change status." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { registrationId, paymentStatus, registrationStatus, notes } = body;

    if (!registrationId || !paymentStatus || !registrationStatus) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: registrationId, paymentStatus, registrationStatus." },
        { status: 400 }
      );
    }

    const updated = await updateRegistrationStatus(
      registrationId,
      paymentStatus as "PENDING" | "VERIFIED" | "REJECTED",
      registrationStatus as "PENDING" | "CONFIRMED" | "REJECTED"
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Registration not found." },
        { status: 404 }
      );
    }

    // Trigger non-blocking status email notification if status is CONFIRMED or REJECTED
    if (registrationStatus === "CONFIRMED" || registrationStatus === "REJECTED") {
      sendStatusUpdateEmail({
        registration: updated,
        status: registrationStatus as "CONFIRMED" | "REJECTED",
        notes,
      }).catch((emailErr) => {
        console.error("Status update email dispatch error:", emailErr);
      });
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${registrationId} updated to ${registrationStatus}.`,
      data: updated,
    });
  } catch (err) {
    console.error("Update registration status error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update registration status." },
      { status: 500 }
    );
  }
}
