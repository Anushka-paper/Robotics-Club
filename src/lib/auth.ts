import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRegistrationByRegistrationId } from "@/lib/db";

export const SESSION_COOKIE_NAME = "embedx_session";

const DEFAULT_SESSION_SECRET = "embedx-development-session-secret-change-me";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export interface SessionPayload {
  registrationId: string;
  email: string;
  issuedAt: number;
  expiresAt: number;
}

function getSessionSecret(): string {
  return process.env.EMBEDX_SESSION_SECRET || DEFAULT_SESSION_SECRET;
}

export function normalizeRegistrationId(input: string): string {
  return input.trim().toUpperCase();
}

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function createSessionPayload(registrationId: string, email: string): SessionPayload {
  const now = Date.now();

  return {
    registrationId: normalizeRegistrationId(registrationId),
    email: normalizeEmail(email),
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
}

export function createSessionToken(session: SessionPayload): string {
  const payload = JSON.stringify(session);
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payloadBase64, signature] = parts;
  if (!payloadBase64 || !signature) {
    return null;
  }

  const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf8");
  if (!payloadJson) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadJson)
    .digest("base64url");

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(payloadJson) as Partial<SessionPayload>;

    if (!parsed.registrationId || !parsed.email || !parsed.expiresAt) {
      return null;
    }

    const expiresAt = Number(parsed.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
      return null;
    }

    return {
      registrationId: normalizeRegistrationId(parsed.registrationId),
      email: normalizeEmail(parsed.email),
      issuedAt: Number(parsed.issuedAt) || Date.now(),
      expiresAt,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, session: SessionPayload) {
  const maxAgeSeconds = Math.max(1, Math.floor((session.expiresAt - Date.now()) / 1000));

  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthenticatedRegistration() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return null;
  }

  const registration = await getRegistrationByRegistrationId(session.registrationId);
  if (!registration) {
    return null;
  }

  if (normalizeEmail(registration.email) !== session.email) {
    return null;
  }

  return registration;
}

export function getSessionFromCookieValue(token?: string | null) {
  return verifySessionToken(token);
}
