import mongoose, { Schema, Document, Model } from "mongoose";
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

export interface IRegistrationDocument extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<MemberItem>(
  {
    name: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    email: { type: String, default: "" },
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    registrationId: { type: String, required: true, unique: true, index: true },
    teamName: { type: String, required: true },
    leaderName: { type: String, required: true },
    leaderBranch: { type: String, required: true },
    leaderYear: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    memberCount: { type: Number, required: true },
    members: { type: [MemberSchema], default: [] },
    utr: { type: String, required: true, unique: true, uppercase: true, index: true },
    paymentScreenshotUrl: { type: String, required: true },
    paymentScreenshotPath: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    registrationStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

// Reuse model instance across Next.js API reloads
let RegistrationModel: Model<IRegistrationDocument>;

try {
  RegistrationModel = mongoose.model<IRegistrationDocument>("Registration");
} catch {
  RegistrationModel = mongoose.model<IRegistrationDocument>("Registration", RegistrationSchema);
}

// Global cached connection for Next.js serverless/API routes
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongodbUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!mongodbUri) {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      throw new Error(
        "MONGODB_URI is not configured in Vercel Environment Variables. Please set MONGODB_URI in your Vercel Project Settings."
      );
    }
  }

  const targetUri = mongodbUri || "mongodb://localhost:27017/embedx";

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(targetUri, {
        bufferCommands: false,
        dbName: "embedx",
        serverSelectionTimeoutMS: 6000, // 6 seconds fast timeout instead of hanging 30s
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error("MongoDB Atlas connection error:", e);
    throw new Error(
      "Database connection timed out. Please check that your MongoDB Atlas 'Network Access' has IP 0.0.0.0/0 (Allow access from anywhere) enabled."
    );
  }

  return cached.conn;
}

function docToRecord(doc: IRegistrationDocument | null): RegistrationRecord | null {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    registrationId: doc.registrationId,
    teamName: doc.teamName,
    leaderName: doc.leaderName,
    leaderBranch: doc.leaderBranch,
    leaderYear: doc.leaderYear,
    mobile: doc.mobile,
    email: doc.email,
    memberCount: doc.memberCount,
    members: doc.members || [],
    utr: doc.utr,
    paymentScreenshotUrl: doc.paymentScreenshotUrl,
    paymentScreenshotPath: doc.paymentScreenshotPath,
    paymentStatus: doc.paymentStatus,
    registrationStatus: doc.registrationStatus,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
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
  await connectToDatabase();

  const created = await RegistrationModel.create({
    registrationId: data.registrationId,
    teamName: data.teamName,
    leaderName: data.leaderName,
    leaderBranch: data.leaderBranch,
    leaderYear: data.leaderYear,
    mobile: data.mobile,
    email: data.email.toLowerCase().trim(),
    memberCount: data.memberCount,
    members: data.members || [],
    utr: data.utr.trim().toUpperCase(),
    paymentScreenshotUrl: data.paymentScreenshotUrl,
    paymentScreenshotPath: data.paymentScreenshotPath,
    paymentStatus: data.paymentStatus || "PENDING",
    registrationStatus: data.registrationStatus || "PENDING",
  });

  return docToRecord(created)!;
}

export async function getRegistrationByRegistrationId(
  registrationId: string
): Promise<RegistrationRecord | null> {
  await connectToDatabase();
  const doc = await RegistrationModel.findOne({
    registrationId: registrationId.trim().toUpperCase(),
  }).exec();
  return docToRecord(doc);
}

export async function getRegistrationByUtr(
  utr: string
): Promise<RegistrationRecord | null> {
  await connectToDatabase();
  const doc = await RegistrationModel.findOne({
    utr: utr.trim().toUpperCase(),
  }).exec();
  return docToRecord(doc);
}

export async function getRegistrationByEmail(
  email: string
): Promise<RegistrationRecord | null> {
  await connectToDatabase();
  const doc = await RegistrationModel.findOne({
    email: email.trim().toLowerCase(),
  }).exec();
  return docToRecord(doc);
}

export async function updateRegistrationStatus(
  registrationId: string,
  paymentStatus: "PENDING" | "VERIFIED" | "REJECTED",
  registrationStatus: "PENDING" | "CONFIRMED" | "REJECTED"
): Promise<RegistrationRecord | null> {
  await connectToDatabase();
  const updated = await RegistrationModel.findOneAndUpdate(
    { registrationId: registrationId.trim().toUpperCase() },
    { paymentStatus, registrationStatus },
    { new: true }
  ).exec();
  return docToRecord(updated);
}

export async function getAllRegistrations(options?: {
  status?: string;
  query?: string;
}): Promise<RegistrationRecord[]> {
  await connectToDatabase();

  const filter: Record<string, unknown> = {};

  if (options?.status && options.status !== "ALL") {
    filter.$or = [
      { registrationStatus: options.status },
      { paymentStatus: options.status },
    ];
  }

  if (options?.query && options.query.trim() !== "") {
    const q = options.query.trim();
    const regex = new RegExp(q, "i");
    filter.$or = [
      { teamName: regex },
      { leaderName: regex },
      { email: regex },
      { registrationId: regex },
      { utr: regex },
    ];
  }

  const docs = await RegistrationModel.find(filter)
    .sort({ createdAt: -1 })
    .exec();

  return docs.map((doc) => docToRecord(doc)!);
}

export async function getRegistrationStats(): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  rejected: number;
}> {
  await connectToDatabase();

  const [total, pending, confirmed, rejected] = await Promise.all([
    RegistrationModel.countDocuments(),
    RegistrationModel.countDocuments({ registrationStatus: "PENDING" }),
    RegistrationModel.countDocuments({ registrationStatus: "CONFIRMED" }),
    RegistrationModel.countDocuments({ registrationStatus: "REJECTED" }),
  ]);

  return { total, pending, confirmed, rejected };
}
