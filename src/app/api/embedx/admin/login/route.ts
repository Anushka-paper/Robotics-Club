import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || typeof password !== "string" || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid admin passkey." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      token: expectedPassword,
    });

    response.cookies.set("embedx_admin_auth", expectedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}
