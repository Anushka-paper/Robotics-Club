import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

export interface MemberItem {
  name: string;
  branch: string;
  year: string;
  email: string;
}

export interface RegistrationRecord {
  id: string;
  registrationId: string;
  teamName: string;
  leaderName: string;
  leaderBranch: string;
  leaderYear: string;
  mobile: string;
  email: string;
  memberCount: number;
  members: MemberItem[];
  utr: string;
  paymentScreenshotUrl: string;
  paymentScreenshotPath: string;
  paymentStatus: "PENDING" | "VERIFIED" | "REJECTED";
  registrationStatus: "PENDING" | "CONFIRMED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

interface RawDbRow {
  id: string;
  registrationId: string;
  teamName: string;
  leaderName: string;
  leaderBranch: string;
  leaderYear: string;
  mobile: string;
  email: string;
  memberCount: number;
  members: string;
  utr: string;
  paymentScreenshotUrl: string;
  paymentScreenshotPath: string;
  paymentStatus: string;
  registrationStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Global database instance singleton
let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, "embedx.db");
  const db = new DatabaseSync(dbPath);

  // Enable WAL mode for high concurrency
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  // Create table schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      registrationId TEXT UNIQUE NOT NULL,
      teamName TEXT NOT NULL,
      leaderName TEXT NOT NULL,
      leaderBranch TEXT NOT NULL,
      leaderYear TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      memberCount INTEGER NOT NULL,
      members TEXT NOT NULL,
      utr TEXT UNIQUE NOT NULL,
      paymentScreenshotUrl TEXT NOT NULL,
      paymentScreenshotPath TEXT NOT NULL,
      paymentStatus TEXT NOT NULL DEFAULT 'PENDING',
      registrationStatus TEXT NOT NULL DEFAULT 'PENDING',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
    CREATE INDEX IF NOT EXISTS idx_reg_regid ON registrations(registrationId);
    CREATE INDEX IF NOT EXISTS idx_reg_utr ON registrations(utr);
  `);

  dbInstance = db;
  return db;
}

function parseRow(row: RawDbRow | null | undefined): RegistrationRecord | null {
  if (!row) return null;
  let parsedMembers: MemberItem[] = [];
  try {
    parsedMembers = JSON.parse(row.members || "[]");
  } catch {
    parsedMembers = [];
  }

  return {
    ...row,
    members: parsedMembers,
    paymentStatus: row.paymentStatus as RegistrationRecord["paymentStatus"],
    registrationStatus: row.registrationStatus as RegistrationRecord["registrationStatus"]
  };
}

export function generateRegistrationId(): string {
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  const year = "2026";
  return `EMBX-${year}-${randomSuffix}`;
}

export async function createRegistration(
  data: Omit<RegistrationRecord, "id" | "createdAt" | "updatedAt">
): Promise<RegistrationRecord> {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const membersJson = JSON.stringify(data.members || []);

  const stmt = db.prepare(`
    INSERT INTO registrations (
      id, registrationId, teamName, leaderName, leaderBranch, leaderYear,
      mobile, email, memberCount, members, utr, paymentScreenshotUrl,
      paymentScreenshotPath, paymentStatus, registrationStatus, createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  stmt.run(
    id,
    data.registrationId,
    data.teamName,
    data.leaderName,
    data.leaderBranch,
    data.leaderYear,
    data.mobile,
    data.email,
    data.memberCount,
    membersJson,
    data.utr.trim().toUpperCase(),
    data.paymentScreenshotUrl,
    data.paymentScreenshotPath,
    data.paymentStatus || "PENDING",
    data.registrationStatus || "PENDING",
    now,
    now
  );

  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now
  };
}

export async function getRegistrationByRegistrationId(
  registrationId: string
): Promise<RegistrationRecord | null> {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM registrations WHERE registrationId = ? LIMIT 1");
  const row = stmt.get(registrationId) as unknown as RawDbRow | undefined;
  return parseRow(row);
}

export async function getRegistrationByUtr(
  utr: string
): Promise<RegistrationRecord | null> {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM registrations WHERE utr = ? LIMIT 1");
  const row = stmt.get(utr.trim().toUpperCase()) as unknown as RawDbRow | undefined;
  return parseRow(row);
}

export async function getRegistrationByEmail(
  email: string
): Promise<RegistrationRecord | null> {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM registrations WHERE LOWER(email) = LOWER(?) LIMIT 1");
  const row = stmt.get(email.trim()) as unknown as RawDbRow | undefined;
  return parseRow(row);
}

export async function updateRegistrationStatus(
  registrationId: string,
  paymentStatus: "PENDING" | "VERIFIED" | "REJECTED",
  registrationStatus: "PENDING" | "CONFIRMED" | "REJECTED"
): Promise<RegistrationRecord | null> {
  const db = getDatabase();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE registrations
    SET paymentStatus = ?, registrationStatus = ?, updatedAt = ?
    WHERE registrationId = ?
  `);
  stmt.run(paymentStatus, registrationStatus, now, registrationId);
  return getRegistrationByRegistrationId(registrationId);
}

export async function getAllRegistrations(): Promise<RegistrationRecord[]> {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM registrations ORDER BY createdAt DESC");
  const rows = stmt.all() as unknown as RawDbRow[];
  return rows.map((r) => parseRow(r)!);
}
