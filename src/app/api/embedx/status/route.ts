import { NextResponse } from "next/server";
import { connectToDatabase, SystemSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const setting = await SystemSettings.findOne({ key: "registrationsClosed" });
    return NextResponse.json({ registrationsClosed: setting?.value === true });
  } catch (err) {
    console.error("Status check error:", err);
    // Fail open: if the status check itself fails, don't block registration on that alone.
    return NextResponse.json({ registrationsClosed: false });
  }
}
