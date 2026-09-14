import { NextRequest, NextResponse } from "next/server";
import { getRegistrationByRegistrationId, deleteRegistrationByRegistrationId } from "@/lib/db";
import fs from "node:fs";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";
  const authHeader = request.headers.get("authorization") || "";
  const customHeader = request.headers.get("x-admin-password") || "";
  const cookiePass = request.cookies.get("embedx_admin_auth")?.value || "";

  return (
    authHeader.replace("Bearer ", "").trim() === expectedPassword ||
    customHeader.trim() === expectedPassword ||
    cookiePass === expectedPassword
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { registrationId } = await params;
    const registration = await getRegistrationByRegistrationId(registrationId);

    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (err) {
    console.error("Admin fetch single registration error:", err);
    return NextResponse.json({ success: false, error: "Failed to load registration." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { registrationId } = await params;
    const deleted = await deleteRegistrationByRegistrationId(registrationId);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Registration not found." }, { status: 404 });
    }

    // Best-effort cleanup of the uploaded receipt file, if it was stored on disk
    // (not applicable when it's a base64 data: URL, e.g. on Vercel).
    if (deleted.paymentScreenshotPath && !deleted.paymentScreenshotPath.startsWith("data:") && deleted.paymentScreenshotPath !== "vercel_base64" && deleted.paymentScreenshotPath !== "fallback_base64") {
      fs.promises.unlink(deleted.paymentScreenshotPath).catch(() => {
        // Non-critical: file may already be gone or path may be unavailable in this environment.
      });
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${deleted.registrationId} deleted.`,
    });
  } catch (err) {
    console.error("Admin delete registration error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete registration." }, { status: 500 });
  }
}
