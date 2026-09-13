import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionPayload, setSessionCookie } from "@/lib/auth";
import { getRegistrationByRegistrationId } from "@/lib/db";

const loginSchema = z.object({
  registrationId: z.string().trim().min(1, "Registration ID is required").max(32),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration ID or leader email.",
        },
        { status: 400 }
      );
    }

    const registrationId = parsed.data.registrationId.trim().toUpperCase();

    if (!/^EMBX-\d{4}-[A-F0-9]{4}$/i.test(registrationId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration ID or leader email.",
        },
        { status: 401 }
      );
    }

    const registration = await getRegistrationByRegistrationId(registrationId);

    if (!registration || registration.email.toLowerCase() !== parsed.data.email.trim().toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration ID or leader email.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      registrationId: registration.registrationId,
      message: "Login successful.",
    });

    setSessionCookie(response, createSessionPayload(registration.registrationId, registration.email));

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while logging in. Please try again.",
      },
      { status: 500 }
    );
  }
}
