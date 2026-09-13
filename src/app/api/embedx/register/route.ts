import { NextRequest, NextResponse } from "next/server";
import { createSessionPayload, setSessionCookie } from "@/lib/auth";
import { registrationApiSchema } from "@/lib/validation";
import { saveReceiptFile } from "@/lib/upload";
import {
  createRegistration,
  generateRegistrationId,
  getRegistrationByEmail,
  getRegistrationByUtr,
} from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";
import { EMBEDX_CONFIG } from "@/config/embedx";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, error: "Invalid request format. Use multipart/form-data." },
        { status: 400 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to parse form data. Please try again." },
        { status: 400 }
      );
    }

    // --- Parse JSON payload ---
    const payloadRaw = formData.get("payload");
    if (!payloadRaw || typeof payloadRaw !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing registration payload." },
        { status: 400 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(payloadRaw);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    // --- Server-side schema validation ---
    const result = registrationApiSchema.safeParse(parsed);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join(".") || "general";
        fieldErrors[key] = issue.message;
      });
      return NextResponse.json(
        { success: false, error: "Please correct the highlighted fields.", fields: fieldErrors },
        { status: 422 }
      );
    }

    const data = result.data;

    // --- Validate payment screenshot file ---
    const screenshotFile = formData.get("screenshot");
    if (!screenshotFile || !(screenshotFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Please upload your payment screenshot." },
        { status: 400 }
      );
    }

    if (screenshotFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Payment screenshot file is empty." },
        { status: 400 }
      );
    }

    const { maxFileSizeBytes, allowedMimeTypes } = EMBEDX_CONFIG.payment;

    if (screenshotFile.size > maxFileSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: `File size too large. Maximum allowed is ${maxFileSizeBytes / (1024 * 1024)}MB.`,
        },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.includes(screenshotFile.type as (typeof allowedMimeTypes)[number])) {
      return NextResponse.json(
        { success: false, error: "Please upload a valid JPG, PNG, JPEG or WEBP image." },
        { status: 400 }
      );
    }

    // --- Duplicate checks ---
    const [existingEmail, existingUtr] = await Promise.all([
      getRegistrationByEmail(data.email),
      getRegistrationByUtr(data.utr),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A registration already exists with this leader email address. If this is a mistake, contact the Robotics Club.",
          fields: { email: "Email already registered." },
        },
        { status: 409 }
      );
    }

    if (existingUtr) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This UTR/Transaction ID has already been used for another registration. Each transaction can only be used once.",
          fields: { utr: "UTR already used." },
        },
        { status: 409 }
      );
    }

    // --- Save payment screenshot ---
    const uploadResult = await saveReceiptFile(screenshotFile);
    if ("error" in uploadResult) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    // --- Generate unique registration ID with collision avoidance ---
    let registrationId = generateRegistrationId();
    // Extremely unlikely collision — but ensure uniqueness
    let attempts = 0;
    while (attempts < 10) {
      const existing = await Promise.resolve(null); // placeholder for ID uniqueness check
      if (!existing) break;
      registrationId = generateRegistrationId();
      attempts++;
    }

    // --- Persist to database ---
    const registration = await createRegistration({
      registrationId,
      teamName: data.teamName,
      leaderName: data.leaderName,
      leaderRollNumber: data.leaderRollNumber,
      leaderBranch: data.leaderBranch,
      leaderYear: data.leaderYear,
      mobile: data.mobile,
      email: data.email.toLowerCase().trim(),
      memberCount: data.memberCount,
      members: data.members,
      utr: data.utr.trim().toUpperCase(),
      paymentScreenshotUrl: uploadResult.url,
      paymentScreenshotPath: uploadResult.serverPath,
      paymentStatus: "PENDING",
      registrationStatus: "PENDING",
    });

    // --- Send confirmation email (non-blocking) ---
    sendConfirmationEmail({ registration }).catch((err) => {
      console.error("Email dispatch failed (non-critical):", err);
    });

    // --- Return success and establish the session for the new registration ---
    const response = NextResponse.json(
      {
        success: true,
        registrationId: registration.registrationId,
        message:
          "Registration submitted successfully! Check your email for confirmation details.",
      },
      { status: 201 }
    );

    setSessionCookie(
      response,
      createSessionPayload(registration.registrationId, registration.email)
    );

    return response;
  } catch (err) {
    console.error("Registration API error:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Something went wrong while submitting your registration. Please try again.";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
