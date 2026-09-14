import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, SystemSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

const checkAdminAuth = (request: NextRequest) => {
  const passkey = request.headers.get("x-admin-password");
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";
  return passkey === expectedPassword;
};

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const settings = await SystemSettings.find({});
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as any);
    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: "Key is required" }, { status: 400 });
    }

    await connectToDatabase();
    await SystemSettings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: "Setting updated" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
