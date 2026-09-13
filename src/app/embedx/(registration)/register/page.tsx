"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EMBEDX_CONFIG } from "@/config/embedx";
import { teamDetailsSchema, memberSchema, paymentSchema } from "@/lib/validation";
import { Camera, AlertTriangle, Search, Check, CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface MemberData {
  name: string;
  rollNumber: string;
  branch: string;
  year: string;
  email: string;
}

interface TeamData {
  teamName: string;
  leaderName: string;
  leaderRollNumber: string;
  leaderBranch: string;
  leaderYear: string;
  mobile: string;
  email: string;
  memberCount: number;
}

interface FormErrors {
  [key: string]: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────
function StepIndicator({ currentStep, skipMembers }: { currentStep: number; skipMembers: boolean }) {
  const steps = skipMembers
    ? [
      { n: 1, label: "Team Details" },
      { n: 3, label: "Payment" },
    ]
    : [
      { n: 1, label: "Team Details" },
      { n: 2, label: "Members" },
      { n: 3, label: "Payment" },
    ];

  const displayIndex = skipMembers
    ? [1, 3].indexOf(currentStep)
    : currentStep - 1;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          overflowX: "auto",
          paddingBottom: "0.25rem",
        }}
      >
        {steps.map((step, idx) => {
          const stepDisplay = idx + 1;
          let state: "active" | "complete" | "inactive";
          if (step.n === currentStep) state = "active";
          else if (
            (skipMembers && currentStep === 3 && step.n === 1) ||
            (!skipMembers && step.n < currentStep)
          )
            state = "complete";
          else state = "inactive";

          return (
            <div
              key={step.n}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", minWidth: "80px" }}>
                <div
                  className={
                    state === "active"
                      ? "step-active"
                      : state === "complete"
                        ? "step-complete"
                        : "step-inactive"
                  }
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "all 0.25s ease",
                  }}
                >
                  {state === "complete" ? <Check size={14} /> : `0${stepDisplay}`}
                </div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: state === "active" ? 600 : 400,
                    color: state === "active" ? "#00f0ff" : state === "complete" ? "#38bdf8" : "#475569",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.03em",
                    transition: "color 0.25s ease",
                  }}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    background:
                      (skipMembers
                        ? currentStep === 3 && step.n === 1
                        : step.n < currentStep)
                        ? "linear-gradient(to right, rgba(0,200,215,0.5), rgba(0,200,215,0.15))"
                        : "rgba(255,255,255,0.06)",
                    flexShrink: 0,
                    marginBottom: "18px",
                    transition: "background 0.25s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────
function Field({
  label,
  id,
  required = true,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        htmlFor={id}
        style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#94a3b8", letterSpacing: "0.02em" }}
      >
        {label}
        {required && <span style={{ color: "#00f0ff", marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {error && (
        <span
          role="alert"
          style={{ fontSize: "0.75rem", color: "#f87171", display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <AlertTriangle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

type TeamChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
type MemberChangeHandler = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

type Step1Props = {
  team: TeamData;
  errors: FormErrors;
  handleTeamChange: TeamChangeHandler;
  handleTeamContinue: () => void;
  inputStyle: (errKey: string) => React.CSSProperties;
  selectStyle: (errKey: string) => React.CSSProperties;
  gridTwoCol: React.CSSProperties;
  skipMembers: boolean;
};

type Step2Props = {
  members: MemberData[];
  errors: FormErrors;
  additionalMemberCount: number;
  handleMemberChange: MemberChangeHandler;
  handleMemberContinue: () => void;
  inputStyle: (errKey: string) => React.CSSProperties;
  selectStyle: (errKey: string) => React.CSSProperties;
  gridTwoCol: React.CSSProperties;
  onBack: () => void;
};

type Step3Props = {
  utr: string;
  errors: FormErrors;
  screenshotFile: File | null;
  screenshotPreview: string | null;
  dragOver: boolean;
  submitting: boolean;
  submitError: string | null;
  handleUtrChange: (value: string) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  handleSubmit: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  inputStyle: (errKey: string) => React.CSSProperties;
};

function Step1({
  team,
  errors,
  handleTeamChange,
  handleTeamContinue,
  inputStyle,
  selectStyle,
  gridTwoCol,
  skipMembers,
}: Step1Props) {
  return (
    <div className="animate-step-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1.375rem", fontWeight: 700, color: "#f0f6ff", marginBottom: "0.25rem" }}>
          Team Details
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Tell us about your EmbedX team.</p>
      </div>

      <hr className="cyan-divider" style={{ margin: "0" }} />

      <div style={gridTwoCol}>
        <Field label="Team Name" id="teamName" error={errors.teamName}>
          <input
            id="teamName"
            name="teamName"
            type="text"
            value={team.teamName}
            onChange={handleTeamChange}
            placeholder="e.g. Circuit Breakers"
            autoComplete="off"
            style={inputStyle("teamName")}
            aria-describedby={errors.teamName ? "teamName-error" : undefined}
          />
        </Field>

        <Field label="Leader Name" id="leaderName" error={errors.leaderName}>
          <input
            id="leaderName"
            name="leaderName"
            type="text"
            value={team.leaderName}
            onChange={handleTeamChange}
            placeholder="Full name"
            autoComplete="name"
            style={inputStyle("leaderName")}
          />
        </Field>

        <Field label="Leader Roll Number" id="leaderRollNumber" error={errors.leaderRollNumber}>
          <input
            id="leaderRollNumber"
            name="leaderRollNumber"
            type="text"
            value={team.leaderRollNumber}
            onChange={handleTeamChange}
            placeholder="e.g. 2026XXXXXX"
            autoComplete="off"
            style={inputStyle("leaderRollNumber")}
          />
        </Field>

        <Field label="Branch" id="leaderBranch" error={errors.leaderBranch}>
          <select
            id="leaderBranch"
            name="leaderBranch"
            value={team.leaderBranch}
            onChange={handleTeamChange}
            style={selectStyle("leaderBranch")}
          >
            <option value="">Select branch</option>
            {EMBEDX_CONFIG.branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>

        <Field label="Year" id="leaderYear" error={errors.leaderYear}>
          <select
            id="leaderYear"
            name="leaderYear"
            value={team.leaderYear}
            onChange={handleTeamChange}
            style={selectStyle("leaderYear")}
          >
            <option value="">Select year</option>
            {EMBEDX_CONFIG.years.map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </Field>

        <Field label="Mobile Number" id="mobile" error={errors.mobile}>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            value={team.mobile}
            onChange={handleTeamChange}
            placeholder="Mobile Number"
            maxLength={10}
            autoComplete="tel"
            style={inputStyle("mobile")}
          />
        </Field>

        <Field label="Leader's Email Address" id="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={team.email}
            onChange={handleTeamChange}
            placeholder="leader@example.com"
            autoComplete="email"
            style={inputStyle("email")}
          />
        </Field>

        <Field label="Number of Members" id="memberCount" error={errors.memberCount}>
          <select
            id="memberCount"
            name="memberCount"
            value={team.memberCount}
            onChange={handleTeamChange}
            style={selectStyle("memberCount")}
          >
            {EMBEDX_CONFIG.memberCountOptions.map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "member (Solo)" : n === 2 ? "members (Duo)" : "members (Trio)"}</option>
            ))}
          </select>
        </Field>
      </div>

      {team.memberCount === 1 && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: "0.5rem", fontSize: "0.8125rem", color: "#7dd3fc" }}>
          ℹ Solo team — payment step follows directly.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" onClick={handleTeamContinue} style={{ minWidth: "160px" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

function Step2({
  members,
  errors,
  additionalMemberCount,
  handleMemberChange,
  handleMemberContinue,
  inputStyle,
  selectStyle,
  gridTwoCol,
  onBack,
}: Step2Props) {
  return (
    <div className="animate-step-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1.375rem", fontWeight: 700, color: "#f0f6ff", marginBottom: "0.25rem" }}>
          Member Details
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Add the remaining members of your team. The leader is already counted.
        </p>
      </div>

      <hr className="cyan-divider" style={{ margin: "0" }} />

      {Array.from({ length: additionalMemberCount }).map((_, idx) => (
        <div key={idx}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#00f0ff", marginBottom: "0.875rem" }}>
            Member {idx + 1}
          </div>
          <div style={gridTwoCol}>
            <Field label="Name" id={`member${idx}-name`} error={errors[`member${idx}.name`]}>
              <input
                id={`member${idx}-name`}
                name="name"
                type="text"
                value={members[idx]?.name || ""}
                onChange={(e) => handleMemberChange(idx, e)}
                placeholder="Full name"
                style={inputStyle(`member${idx}.name`)}
              />
            </Field>

            <Field label="Roll Number" id={`member${idx}-rollNumber`} error={errors[`member${idx}.rollNumber`]}>
              <input
                id={`member${idx}-rollNumber`}
                name="rollNumber"
                type="text"
                value={members[idx]?.rollNumber || ""}
                onChange={(e) => handleMemberChange(idx, e)}
                placeholder="e.g. 2024CS102"
                style={inputStyle(`member${idx}.rollNumber`)}
              />
            </Field>

            <Field label="Branch" id={`member${idx}-branch`} error={errors[`member${idx}.branch`]}>
              <select
                id={`member${idx}-branch`}
                name="branch"
                value={members[idx]?.branch || ""}
                onChange={(e) => handleMemberChange(idx, e)}
                style={selectStyle(`member${idx}.branch`)}
              >
                <option value="">Select branch</option>
                {EMBEDX_CONFIG.branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>

            <Field label="Year" id={`member${idx}-year`} error={errors[`member${idx}.year`]}>
              <select
                id={`member${idx}-year`}
                name="year"
                value={members[idx]?.year || ""}
                onChange={(e) => handleMemberChange(idx, e)}
                style={selectStyle(`member${idx}.year`)}
              >
                <option value="">Select year</option>
                {EMBEDX_CONFIG.years.map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </Field>

            <Field label="Email" id={`member${idx}-email`} error={errors[`member${idx}.email`]}>
              <input
                id={`member${idx}-email`}
                name="email"
                type="email"
                value={members[idx]?.email || ""}
                onChange={(e) => handleMemberChange(idx, e)}
                placeholder="member@example.com"
                style={inputStyle(`member${idx}.email`)}
              />
            </Field>
          </div>
          {idx < additionalMemberCount - 1 && <hr className="cyan-divider" />}
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-primary" onClick={handleMemberContinue} style={{ minWidth: "180px" }}>
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

function Step3({
  utr,
  errors,
  screenshotFile,
  screenshotPreview,
  dragOver,
  submitting,
  submitError,
  handleUtrChange,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleFileInputChange,
  onBack,
  handleSubmit,
  fileInputRef,
  inputStyle,
}: Step3Props) {
  return (
    <div className="animate-step-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1.375rem", fontWeight: 700, color: "#f0f6ff", marginBottom: "0.25rem" }}>
          Complete Payment
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Pay the required kit fee and submit your transaction details.
        </p>
      </div>

      <hr className="cyan-divider" style={{ margin: "0" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "200px",
            height: "200px",
            background: "rgba(0, 240, 255, 0.04)",
            border: "2px dashed rgba(0, 240, 255, 0.25)",
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {EMBEDX_CONFIG.payment.qrCodeImageUrl ? (
            <Image
              src={EMBEDX_CONFIG.payment.qrCodeImageUrl}
              alt="Payment QR Code"
              fill
              style={{ objectFit: "contain", padding: "8px" }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.4 }}>
                <rect x="4" y="4" width="28" height="28" rx="2" stroke="#00f0ff" strokeWidth="2" />
                <rect x="10" y="10" width="16" height="16" rx="1" fill="#00f0ff" fillOpacity="0.3" />
                <rect x="48" y="4" width="28" height="28" rx="2" stroke="#00f0ff" strokeWidth="2" />
                <rect x="54" y="10" width="16" height="16" rx="1" fill="#00f0ff" fillOpacity="0.3" />
                <rect x="4" y="48" width="28" height="28" rx="2" stroke="#00f0ff" strokeWidth="2" />
                <rect x="10" y="54" width="16" height="16" rx="1" fill="#00f0ff" fillOpacity="0.3" />
                <rect x="48" y="48" width="8" height="8" rx="1" fill="#00f0ff" fillOpacity="0.4" />
                <rect x="60" y="48" width="8" height="8" rx="1" fill="#00f0ff" fillOpacity="0.4" />
                <rect x="48" y="60" width="8" height="8" rx="1" fill="#00f0ff" fillOpacity="0.4" />
                <rect x="60" y="60" width="8" height="8" rx="1" fill="#00f0ff" fillOpacity="0.4" />
              </svg>
              <div style={{ fontSize: "0.65rem", color: "#00f0ff", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "0.5rem" }}>
                {EMBEDX_CONFIG.payment.qrPlaceholderText}
              </div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>{EMBEDX_CONFIG.payment.qrScanInstruction}</div>
          <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem" }}>
            UPI ID: <span style={{ color: "#7dd3fc", fontFamily: "monospace" }}>{EMBEDX_CONFIG.payment.upiId}</span>
          </div>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#00f0ff", marginTop: "0.5rem" }}>
            Kit Fee: {EMBEDX_CONFIG.kitFee}
          </div>
          {EMBEDX_CONFIG.payment.qrCodeImageUrl && (
            <a
              href={EMBEDX_CONFIG.payment.qrCodeImageUrl}
              download="embedx-payment-qr.jpeg"
              className="btn-secondary"
              style={{ marginTop: "0.75rem", display: "inline-flex" }}
            >
              Download QR Code
            </a>
          )}
        </div>
      </div>

      <hr className="cyan-divider" style={{ margin: "0" }} />

      <Field label="UTR / Transaction ID" id="utr" error={errors.utr}>
        <input
          id="utr"
          name="utr"
          type="text"
          value={utr}
          onChange={(e) => handleUtrChange(e.target.value)}
          placeholder="e.g. 425761234567"
          autoComplete="off"
          style={inputStyle("utr")}
        />
      </Field>

      <Field label="Payment Screenshot" id="screenshot" error={errors.screenshot}>
        <div
          className={`upload-zone${dragOver ? " drag-over" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload payment screenshot"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          style={{
            border: `2px dashed ${errors.screenshot ? "rgba(239,68,68,0.4)" : "rgba(0, 240, 255, 0.2)"}`,
            borderRadius: "0.75rem",
            padding: "1.5rem",
            cursor: "pointer",
            textAlign: "center",
            transition: "border-color 0.2s ease, background 0.2s ease",
            background: dragOver ? "rgba(0, 240, 255, 0.04)" : "transparent",
          }}
        >
          {screenshotPreview ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <img
                src={screenshotPreview}
                alt="Payment screenshot preview"
                style={{ maxHeight: "140px", maxWidth: "100%", borderRadius: "0.5rem", border: "1px solid rgba(0,240,255,0.2)" }}
              />
              <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                {screenshotFile?.name} · {screenshotFile ? `${(screenshotFile.size / (1024 * 1024)).toFixed(2)} MB` : "0 MB"}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#00f0ff" }}>Click to change</span>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#38bdf8", display: "flex", justifyContent: "center" }}>
                <Camera size={32} />
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                Click or drag &amp; drop payment screenshot
              </div>
              <div style={{ color: "#475569", fontSize: "0.75rem" }}>
                JPG, JPEG, PNG, WEBP · Max 5MB
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="screenshot"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            aria-label="Upload payment screenshot"
          />
        </div>
      </Field>

      <div style={{ padding: "0.75rem 1rem", background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "0.5rem", fontSize: "0.8125rem", color: "#fbbf24", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
        <span>{EMBEDX_CONFIG.payment.note}</span>
      </div>

      <div style={{ padding: "0.75rem 1rem", background: "rgba(56, 189, 248, 0.05)", border: "1px solid rgba(56, 189, 248, 0.15)", borderRadius: "0.5rem", fontSize: "0.8125rem", color: "#7dd3fc", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
        <Search size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
        <span>Your registration will be confirmed only after manual payment verification by the Robotics Club MMMUT admin team.</span>
      </div>

      {submitError && (
        <div
          role="alert"
          style={{ padding: "0.875rem 1rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#f87171", lineHeight: 1.5, display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <AlertTriangle size={16} />
          <span>{submitError}</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <button
          className="btn-secondary"
          onClick={onBack}
          disabled={submitting}
        >
          ← Back
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ minWidth: "180px", position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(0,13,26,0.4)", borderTopColor: "#000d1a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              <span>Submitting Registration...</span>
            </>
          ) : (
            <>
              <span>Register</span>
              <Check size={16} />
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN REGISTRATION FORM
// ─────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Step state ──────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);

  // ── Team data ───────────────────────────────
  const [team, setTeam] = useState<TeamData>({
    teamName: "",
    leaderName: "",
    leaderRollNumber: "",
    leaderBranch: "",
    leaderYear: "",
    mobile: "",
    email: "",
    memberCount: 1,
  });

  // ── Member data ─────────────────────────────
  const [members, setMembers] = useState<MemberData[]>([
    { name: "", rollNumber: "", branch: "", year: "", email: "" },
    { name: "", rollNumber: "", branch: "", year: "", email: "" },
  ]);

  // ── Payment data ────────────────────────────
  const [utr, setUtr] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Errors / UI state ────────────────────────
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const skipMembers = team.memberCount === 1;
  const additionalMemberCount = team.memberCount - 1;

  // ─────────────────────────────────────────────
  // HANDLERS — Team
  // ─────────────────────────────────────────────
  const handleTeamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTeam((prev) => ({
      ...prev,
      [name]: name === "memberCount" ? Number(value) : value,
    }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validateTeam = (): boolean => {
    const parsed = teamDetailsSchema.safeParse(team);
    if (!parsed.success) {
      const newErrors: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        newErrors[key] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleTeamContinue = () => {
    if (!validateTeam()) return;
    setCurrentStep(skipMembers ? 3 : 2);
    setErrors({});
  };

  // ─────────────────────────────────────────────
  // HANDLERS — Members
  // ─────────────────────────────────────────────
  const handleMemberChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMembers((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [name]: value };
      return updated;
    });
    const errKey = `member${idx}.${name}`;
    if (errors[errKey]) setErrors((prev) => { const n = { ...prev }; delete n[errKey]; return n; });
  };

  const validateMembers = (): boolean => {
    const newErrors: FormErrors = {};
    for (let i = 0; i < additionalMemberCount; i++) {
      const parsed = memberSchema.safeParse(members[i]);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          newErrors[`member${i}.${key}`] = issue.message;
        });
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleMemberContinue = () => {
    if (!validateMembers()) return;
    setCurrentStep(3);
    setErrors({});
  };

  // ─────────────────────────────────────────────
  // HANDLERS — Payment / File
  // ─────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File) => {
    const { maxFileSizeBytes, allowedMimeTypes } = EMBEDX_CONFIG.payment;
    if (file.size > maxFileSizeBytes) {
      setErrors((prev) => ({
        ...prev,
        screenshot: `File too large. Max ${maxFileSizeBytes / (1024 * 1024)}MB allowed.`,
      }));
      return;
    }
    if (!allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number])) {
      setErrors((prev) => ({
        ...prev,
        screenshot: "Please upload a valid JPG, PNG, JPEG or WEBP image.",
      }));
      return;
    }
    setScreenshotFile(file);
    const url = URL.createObjectURL(file);
    setScreenshotPreview(url);
    setErrors((prev) => { const n = { ...prev }; delete n.screenshot; return n; });
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const validatePayment = (): boolean => {
    const paymentParsed = paymentSchema.safeParse({ utr });
    const newErrors: FormErrors = {};
    if (!paymentParsed.success) {
      paymentParsed.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
    }
    if (!screenshotFile) {
      newErrors.screenshot = "Please upload your payment screenshot.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // ─────────────────────────────────────────────
  // FINAL SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validatePayment()) return;
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderRollNumber: team.leaderRollNumber,
        leaderBranch: team.leaderBranch,
        leaderYear: team.leaderYear,
        mobile: team.mobile,
        email: team.email,
        memberCount: team.memberCount,
        members: members.slice(0, additionalMemberCount),
        utr: utr.trim(),
      };

      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      formData.append("screenshot", screenshotFile!);

      const res = await fetch("/api/embedx/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(
          data.error || "Something went wrong while submitting your registration. Please try again."
        );
        if (data.fields) {
          const serverErrors: FormErrors = {};
          Object.entries(data.fields).forEach(([k, v]) => {
            serverErrors[k] = v as string;
          });
          setErrors(serverErrors);
        }
        return;
      }

      // Success — redirect to dashboard
      router.push(`/embedx/dashboard/${data.registrationId}`);
    } catch {
      setSubmitError("Something went wrong while submitting your registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────
  const inputStyle = (errKey: string): React.CSSProperties => ({
    width: "100%",
    background: "rgba(3, 11, 24, 0.7)",
    border: `1px solid ${errors[errKey] ? "rgba(239,68,68,0.5)" : "rgba(0, 240, 255, 0.15)"}`,
    borderRadius: "0.5rem",
    padding: "0.6875rem 0.875rem",
    fontSize: "0.9375rem",
    color: "#f0f6ff",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    fontFamily: "inherit",
    boxShadow: errors[errKey] ? "0 0 8px rgba(239,68,68,0.12)" : "none",
  });

  const selectStyle = (errKey: string): React.CSSProperties => ({
    ...inputStyle(errKey),
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.875rem center",
    paddingRight: "2.25rem",
  });

  const gridTwoCol: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
  };

  // ─────────────────────────────────────────────
  // PAGE
  // ─────────────────────────────────────────────
  return (
    <div
      className="embedx-page-bg"
      style={{ padding: "2rem 1.25rem", minHeight: "calc(100dvh - 120px)", display: "flex", alignItems: "flex-start", justifyContent: "center" }}
    >
      <div style={{ width: "100%", maxWidth: "760px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }} className="animate-fade-in-up">
          <div style={{ fontSize: "0.6875rem", letterSpacing: "3px", textTransform: "uppercase", color: "#38bdf8", fontWeight: 600, marginBottom: "0.4rem" }}>
            Robotics Club MMMUT · presents
          </div>
          <h1
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(1.75rem, 6vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f0f6ff",
              margin: "0 0 0.25rem 0",
            }}
          >
            EMBED<span className="neon-text">X</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
            Team Registration
          </p>
        </div>

        {/* Progress indicator */}
        <StepIndicator currentStep={currentStep} skipMembers={skipMembers} />

        {/* Form card */}
        <div className="glass-card" style={{ padding: "clamp(1.25rem, 4vw, 2rem)" }}>
          {currentStep === 1 && (
            <Step1
              team={team}
              errors={errors}
              handleTeamChange={handleTeamChange}
              handleTeamContinue={handleTeamContinue}
              inputStyle={inputStyle}
              selectStyle={selectStyle}
              gridTwoCol={gridTwoCol}
              skipMembers={skipMembers}
            />
          )}
          {currentStep === 2 && !skipMembers && (
            <Step2
              members={members}
              errors={errors}
              additionalMemberCount={additionalMemberCount}
              handleMemberChange={handleMemberChange}
              handleMemberContinue={handleMemberContinue}
              inputStyle={inputStyle}
              selectStyle={selectStyle}
              gridTwoCol={gridTwoCol}
              onBack={() => { setCurrentStep(1); setErrors({}); }}
            />
          )}
          {currentStep === 3 && (
            <Step3
              utr={utr}
              errors={errors}
              screenshotFile={screenshotFile}
              screenshotPreview={screenshotPreview}
              dragOver={dragOver}
              submitting={submitting}
              submitError={submitError}
              handleUtrChange={(value) => {
                setUtr(value);
                if (errors.utr) setErrors((prev) => { const n = { ...prev }; delete n.utr; return n; });
              }}
              handleDrop={handleDrop}
              handleDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              handleDragLeave={() => setDragOver(false)}
              handleFileInputChange={handleFileInputChange}
              onBack={() => {
                setCurrentStep(skipMembers ? 1 : 2);
                setErrors({});
              }}
              handleSubmit={handleSubmit}
              fileInputRef={fileInputRef}
              inputStyle={inputStyle}
            />
          )}
        </div>

        {/* Small note */}
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#1e293b", marginTop: "1.5rem" }}>
          Registration is valid only after admin verification of your payment. All submissions are logged securely.
        </p>
      </div>
    </div>
  );
}
