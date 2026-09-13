"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EMBEDX_CONFIG } from "@/config/embedx";

interface MemberItem {
  name: string;
  rollNumber: string;
  branch: string;
  year: string;
  email: string;
}

interface RegistrationData {
  registrationId: string;
  teamName: string;
  leaderName: string;
  leaderRollNumber: string;
  leaderBranch: string;
  leaderYear: string;
  mobile: string;
  email: string;
  memberCount: number;
  members: MemberItem[];
  utr: string;
  paymentScreenshotUrl: string;
  paymentStatus: "PENDING" | "VERIFIED" | "REJECTED";
  registrationStatus: "PENDING" | "CONFIRMED" | "REJECTED";
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const cfg =
    EMBEDX_CONFIG.status.registration[
      status as keyof typeof EMBEDX_CONFIG.status.registration
    ] || EMBEDX_CONFIG.status.registration.PENDING;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.3rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.8125rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
      className={cfg.bg}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "currentColor",
          flexShrink: 0,
          animation: status === "PENDING" ? "pulse-slow 2.5s ease-in-out infinite" : undefined,
        }}
      />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const cfg =
    EMBEDX_CONFIG.status.payment[
      status as keyof typeof EMBEDX_CONFIG.status.payment
    ] || EMBEDX_CONFIG.status.payment.PENDING;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.2rem 0.625rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
      className={cfg.bg}
    >
      {cfg.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: "0.625rem 0",
        borderBottom: "1px solid rgba(0, 240, 255, 0.06)",
        fontSize: "0.875rem",
      }}
    >
      <span style={{ color: "#64748b", minWidth: "140px", flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontWeight: 500, wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function ScreenshotModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "90vh",
          background: "#0b1222",
          borderRadius: "1rem",
          overflow: "hidden",
          border: "1px solid rgba(0, 240, 255, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Payment screenshot" style={{ display: "block", maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain" }} />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f6ff",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const params = useParams();
  const registrationId = params.registrationId as string;

  const [data, setData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/embedx/logout", { method: "POST" });
    } catch {
      // Ignore logout request failure and redirect anyway for a smooth UX.
    } finally {
      window.location.href = "/embedx/login";
    }
  };

  useEffect(() => {
    if (!registrationId) return;

    const fetchRegistration = async () => {
      try {
        const res = await fetch(`/api/embedx/registration/${registrationId}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.error || "Registration not found.");
        } else {
          setData(json.data);
        }
      } catch {
        setError("Failed to load registration. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [registrationId]);

  if (loading) {
    return (
      <div className="embedx-page-bg" style={{ minHeight: "calc(100dvh - 120px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(0,240,255,0.15)", borderTopColor: "#00f0ff", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ color: "#475569", fontSize: "0.875rem" }}>Loading registration...</p>
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="embedx-page-bg" style={{ minHeight: "calc(100dvh - 120px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
        <div className="glass-card" style={{ padding: "2rem", maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#f0f6ff", fontWeight: 700, marginBottom: "0.5rem" }}>
            Registration Not Found
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            {error || "We could not find a registration with this ID."}
          </p>
          <Link href="/embedx/register">
            <button className="btn-primary">Register Now</button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(data.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="embedx-page-bg"
      style={{ padding: "2rem 1.25rem", minHeight: "calc(100dvh - 120px)" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }} className="animate-fade-in-up">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #00c8d7, #0ea5e9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem", boxShadow: "0 0 24px rgba(0,200,215,0.35)" }}>
            ✓
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: 800, color: "#f0f6ff", margin: "0 0 0.5rem 0" }}>
            Registration Received
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Submitted on {formattedDate}
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "1.5rem",
            marginBottom: "1.25rem",
            textAlign: "center",
            background: "rgba(0, 40, 80, 0.5)",
            border: "1px solid rgba(0, 240, 255, 0.2)",
          }}
        >
          <div style={{ fontSize: "0.6875rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#64748b", fontWeight: 600, marginBottom: "0.5rem" }}>
            Registration ID
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
              fontWeight: 800,
              color: "#00f0ff",
              textShadow: "0 0 16px rgba(0, 240, 255, 0.4)",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            {data.registrationId}
          </div>
          <StatusBadge status={data.registrationStatus} />
          <p style={{ color: "#94a3b8", fontSize: "0.8125rem", marginTop: "1rem", lineHeight: 1.6 }}>
            Your registration has been received. Registration shall be successful once the payment is verified by the Robotics Club MMMUT team.
          </p>
        </div>

        <div
          style={{
            padding: "0.875rem 1rem",
            background: "rgba(245, 158, 11, 0.06)",
            border: "1px solid rgba(245, 158, 11, 0.18)",
            borderRadius: "0.75rem",
            fontSize: "0.8125rem",
            color: "#fbbf24",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
          }}
        >
          🔍 <strong>Admin Verification Pending:</strong> The Robotics Club MMMUT team will manually verify your payment screenshot and UTR. Once verified, your registration status will update to <em>Confirmed</em>. Please keep your Registration ID handy for any follow-up.
        </div>

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
          <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.5rem" }}>
            Team Details
          </h3>
          <InfoRow label="Team Name" value={data.teamName} />
          <InfoRow label="Leader Name" value={data.leaderName} />
          <InfoRow label="Leader Roll Number" value={data.leaderRollNumber || "—"} />
          <InfoRow label="Branch" value={data.leaderBranch} />
          <InfoRow label="Year" value={`Year ${data.leaderYear}`} />
          <InfoRow label="Mobile" value={data.mobile} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Total Members" value={`${data.memberCount} member${data.memberCount > 1 ? "s" : ""}`} />
        </div>

        {data.members && data.members.length > 0 && (
          <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.75rem" }}>
              Team Members
            </h3>
            {data.members.map((member, idx) => (
              <div key={idx} style={{ marginBottom: idx < data.members.length - 1 ? "1rem" : 0 }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#475569", marginBottom: "0.35rem" }}>
                  Member {idx + 1}
                </div>
                <InfoRow label="Name" value={member.name} />
                <InfoRow label="Roll Number" value={member.rollNumber || "—"} />
                <InfoRow label="Branch" value={member.branch} />
                <InfoRow label="Year" value={`Year ${member.year}`} />
                <InfoRow label="Email" value={member.email} />
              </div>
            ))}
          </div>
        )}

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
          <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.5rem" }}>
            Payment Details
          </h3>
          <InfoRow label="UTR / Txn ID" value={<span style={{ fontFamily: "monospace", color: "#7dd3fc", fontWeight: 600 }}>{data.utr}</span>} />
          <InfoRow label="Payment Status" value={<PaymentBadge status={data.paymentStatus} />} />
          <InfoRow
            label="Screenshot"
            value={
              <button
                onClick={() => setShowModal(true)}
                style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: "0.875rem", textDecoration: "underline", padding: 0 }}
              >
                View Screenshot
              </button>
            }
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
          <Link href="/">
            <button className="btn-secondary">← Back to Home</button>
          </Link>
          <button
            className="btn-secondary"
            onClick={() => window.print()}
            aria-label="Print this page"
          >
            🖨 Save / Print
          </button>
          <button
            className="btn-secondary"
            onClick={handleLogout}
            aria-label="Log out"
          >
            Logout
          </button>
        </div>

        {showModal && (
          <ScreenshotModal
            url={data.paymentScreenshotUrl}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}
