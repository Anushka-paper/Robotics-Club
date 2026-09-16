import { z } from "zod";
import { EMBEDX_CONFIG } from "@/config/embedx";

const branchValues = EMBEDX_CONFIG.branches as unknown as [string, ...string[]];
const yearValues = EMBEDX_CONFIG.years as unknown as [string, ...string[]];

const indianMobileRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  rollNumber: z.string().trim().min(2, "Roll number must be at least 2 characters").max(50),
  branch: z.string().trim().min(1, "Branch is required").max(100),
  year: z.enum(yearValues, { error: "Please select a valid year" }),
  email: z.string().trim().regex(emailRegex, "Enter a valid email address").max(255),
});

export const teamDetailsSchema = z.object({
  teamName: z.string().trim().min(2, "Team name must be at least 2 characters").max(100),
  leaderName: z.string().trim().min(2, "Leader name must be at least 2 characters").max(100),
  leaderRollNumber: z.string().trim().min(2, "Roll number must be at least 2 characters").max(50),
  leaderBranch: z.string().trim().min(1, "Branch is required").max(100),
  leaderYear: z.enum(yearValues, { error: "Please select a year" }),
  mobile: z.string().trim().regex(indianMobileRegex, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().regex(emailRegex, "Enter a valid email address").max(255),
  memberCount: z.number().int().min(1).max(3),
});

export const paymentSchema = z.object({
  utr: z
    .string()
    .min(6, "UTR/Transaction ID must be at least 6 characters")
    .max(64, "UTR/Transaction ID is too long")
    .regex(/^[A-Za-z0-9]+$/, "UTR/Transaction ID must be alphanumeric only"),
});

export const registrationApiSchema = z
  .object({
    teamName: z.string().trim().min(2).max(100),
    leaderName: z.string().trim().min(2).max(100),
    leaderRollNumber: z.string().trim().min(2).max(50),
    leaderBranch: z.string().trim().min(1, "Branch is required").max(100),
    leaderYear: z.enum(yearValues),
    mobile: z.string().trim().regex(indianMobileRegex, "Enter a valid 10-digit Indian mobile number"),
    email: z.string().trim().regex(emailRegex, "Enter a valid email address").max(255),
    memberCount: z.number().int().min(1).max(3),
    members: z.array(memberSchema),
    utr: z
      .string()
      .trim()
      .min(6, "UTR/Transaction ID must be at least 6 characters")
      .max(64)
      .regex(/^[A-Za-z0-9]+$/, "UTR/Transaction ID must be alphanumeric only"),
  })
  .superRefine((data, ctx) => {
    // The leader is member #1 — so additional members count = memberCount - 1
    const expectedAdditionalMembers = data.memberCount - 1;
    if (data.members.length !== expectedAdditionalMembers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Expected ${expectedAdditionalMembers} additional member(s), got ${data.members.length}`,
        path: ["members"],
      });
    }
  });

export type TeamDetailsInput = z.infer<typeof teamDetailsSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type RegistrationApiInput = z.infer<typeof registrationApiSchema>;
