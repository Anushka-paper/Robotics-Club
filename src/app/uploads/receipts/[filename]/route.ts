import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);

    const uploadDir =
      process.env.UPLOAD_DIR ||
      path.join(process.cwd(), "public", "uploads", "receipts");

    const filePath = path.join(/*turbopackIgnore: true*/ uploadDir, safeFilename);

    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ filePath);
    const ext = path.extname(safeFilename).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Error serving uploaded receipt:", err);
    return NextResponse.json({ error: "Failed to read file." }, { status: 500 });
  }
}
