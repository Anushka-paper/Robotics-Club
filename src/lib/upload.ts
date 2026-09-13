import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { EMBEDX_CONFIG } from "@/config/embedx";

const { allowedMimeTypes, allowedExtensions, maxFileSizeBytes } = EMBEDX_CONFIG.payment;

export interface UploadResult {
  url: string;
  serverPath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadError {
  error: string;
}

export function validateReceiptFile(
  file: File
): { valid: true } | { valid: false; error: string } {
  // Validate file size
  if (file.size > maxFileSizeBytes) {
    return {
      valid: false,
      error: `File size too large. Maximum allowed is ${maxFileSizeBytes / (1024 * 1024)}MB.`,
    };
  }

  // Validate MIME type
  if (!allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number])) {
    return {
      valid: false,
      error: "Please upload a valid JPG, PNG, JPEG or WEBP image.",
    };
  }

  // Validate extension
  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(ext as (typeof allowedExtensions)[number])) {
    return {
      valid: false,
      error: "Please upload a valid JPG, PNG, JPEG or WEBP image.",
    };
  }

  return { valid: true };
}

export async function saveReceiptFile(
  file: File
): Promise<UploadResult | UploadError> {
  // Double-check validation server-side
  const validation = validateReceiptFile(file);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const ext = path.extname(file.name).toLowerCase();
  const safeFilename = `${crypto.randomUUID()}${ext}`;

  const uploadDir =
    process.env.UPLOAD_DIR ||
    path.join(process.cwd(), "public", "uploads", "receipts");

  const serverPath = path.join(/*turbopackIgnore: true*/ uploadDir, safeFilename);
  const publicUrl = `/uploads/receipts/${safeFilename}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // On Vercel serverless functions, the filesystem is read-only.
    // Store receipt image as a base64 Data URL in MongoDB Atlas so it persists reliably.
    if (process.env.VERCEL) {
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;
      return {
        url: dataUrl,
        serverPath: "vercel_base64",
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      };
    }

    try {
      if (!fs.existsSync(/*turbopackIgnore: true*/ uploadDir)) {
        fs.mkdirSync(/*turbopackIgnore: true*/ uploadDir, { recursive: true });
      }
      fs.writeFileSync(serverPath, buffer);

      return {
        url: publicUrl,
        serverPath,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      };
    } catch {
      // Fallback to base64 Data URL if filesystem write is prohibited
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;
      return {
        url: dataUrl,
        serverPath: "fallback_base64",
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      };
    }
  } catch (err) {
    console.error("File upload error:", err);
    return { error: "Payment screenshot upload failed. Please try again." };
  }
}
