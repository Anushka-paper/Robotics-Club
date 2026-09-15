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

function EditRow({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (val: string) => void; type?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.625rem 0",
        borderBottom: "1px solid rgba(0, 240, 255, 0.06)",
        fontSize: "0.875rem",
      }}
    >
      <span style={{ color: "#64748b", minWidth: "140px", flexShrink: 0 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          borderRadius: "0.375rem",
          color: "#e2e8f0",
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
          outline: "none"
        }}
      />
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [allowEdits, setAllowEdits] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/embedx/logout", { method: "POST" });
    } catch {
      // Ignore logout request failure and redirect anyway for a smooth UX.
    } finally {
      window.location.href = "/embedx/login";
    }
  };

  const startEditing = () => {
    if (!data) return;
    setEditData({
      leaderName: data.leaderName,
      leaderRollNumber: data.leaderRollNumber,
      leaderBranch: data.leaderBranch,
      leaderYear: data.leaderYear,
      mobile: data.mobile,
      email: data.email,
      members: JSON.parse(JSON.stringify(data.members || []))
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!data || !editData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/embedx/registration/${data.registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setIsEditing(false);
      } else {
        alert(json.error || "Failed to update details.");
      }
    } catch (err) {
      alert("Failed to update details.");
    } finally {
      setSaving(false);
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
          if (json.allowParticipantEdits !== undefined) {
            setAllowEdits(json.allowParticipantEdits);
          }
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

        {data.registrationStatus === "CONFIRMED" ? (
          <div
            style={{
              padding: "1.25rem 1rem",
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1rem",
            }}
          >
            <div style={{ color: "#4ade80" }}>
              ✅ <strong>Registration Confirmed!</strong><br />
              Your payment has been verified. Welcome to the EmbedX Hardware Hackathon. Please join the official WhatsApp group for further updates.
            </div>
            <a 
              href="https://chat.whatsapp.com/Cs854cwBpMeHM8e9fd3myA?s=sh&p=a&mlu=0&ilr=4"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 active:scale-95"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.5rem",
                background: "#25D366",
                color: "#ffffff",
                fontWeight: 700,
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "0.5px",
                borderRadius: "0.5rem",
                textDecoration: "none",
                transition: "all 0.2s",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              JOIN WHATSAPP GROUP
            </a>
          </div>
        ) : (
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
        )}

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", margin: 0 }}>
              Team Details
            </h3>
            {allowEdits && (
              !isEditing ? (
                <button onClick={startEditing} style={{ background: "none", border: "1px solid rgba(56,189,248,0.4)", borderRadius: "0.25rem", color: "#38bdf8", padding: "0.25rem 0.5rem", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-sky-500/10">
                  Edit Details
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => setIsEditing(false)} disabled={saving} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.25rem", color: "#e2e8f0", padding: "0.25rem 0.5rem", fontSize: "0.75rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} style={{ background: "rgba(56,189,248,0.2)", border: "1px solid rgba(56,189,248,0.5)", borderRadius: "0.25rem", color: "#38bdf8", padding: "0.25rem 0.5rem", fontSize: "0.75rem", cursor: "pointer" }}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )
            )}
          </div>
          <InfoRow label="Team Name" value={data.teamName} />
          
          {isEditing ? (
            <>
              <EditRow label="Leader Name" value={editData.leaderName} onChange={val => setEditData({ ...editData, leaderName: val })} />
              <EditRow label="Leader Roll Number" value={editData.leaderRollNumber} onChange={val => setEditData({ ...editData, leaderRollNumber: val })} />
              <EditRow label="Branch" value={editData.leaderBranch} onChange={val => setEditData({ ...editData, leaderBranch: val })} />
              <EditRow label="Year" value={editData.leaderYear} onChange={val => setEditData({ ...editData, leaderYear: val })} />
              <EditRow label="Mobile" value={editData.mobile} onChange={val => setEditData({ ...editData, mobile: val })} />
              <EditRow label="Email" value={editData.email} onChange={val => setEditData({ ...editData, email: val })} type="email" />
            </>
          ) : (
            <>
              <InfoRow label="Leader Name" value={data.leaderName} />
              <InfoRow label="Leader Roll Number" value={data.leaderRollNumber || "—"} />
              <InfoRow label="Branch" value={data.leaderBranch} />
              <InfoRow label="Year" value={`Year ${data.leaderYear}`} />
              <InfoRow label="Mobile" value={data.mobile} />
              <InfoRow label="Email" value={data.email} />
            </>
          )}
          <InfoRow label="Total Members" value={`${data.memberCount} member${data.memberCount > 1 ? "s" : ""}`} />
        </div>

        {data.members && data.members.length > 0 && (
          <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.75rem" }}>
              Team Members
            </h3>
            {(isEditing ? editData.members : data.members).map((member: any, idx: number) => (
              <div key={idx} style={{ marginBottom: idx < data.members.length - 1 ? "1rem" : 0 }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#475569", marginBottom: "0.35rem" }}>
                  Member {idx + 1}
                </div>
                {isEditing ? (
                  <>
                    <EditRow label="Name" value={member.name} onChange={val => { const newM = [...editData.members]; newM[idx].name = val; setEditData({ ...editData, members: newM }) }} />
                    <EditRow label="Roll Number" value={member.rollNumber} onChange={val => { const newM = [...editData.members]; newM[idx].rollNumber = val; setEditData({ ...editData, members: newM }) }} />
                    <EditRow label="Branch" value={member.branch} onChange={val => { const newM = [...editData.members]; newM[idx].branch = val; setEditData({ ...editData, members: newM }) }} />
                    <EditRow label="Year" value={member.year} onChange={val => { const newM = [...editData.members]; newM[idx].year = val; setEditData({ ...editData, members: newM }) }} />
                    <EditRow label="Email" value={member.email} onChange={val => { const newM = [...editData.members]; newM[idx].email = val; setEditData({ ...editData, members: newM }) }} type="email" />
                  </>
                ) : (
                  <>
                    <InfoRow label="Name" value={member.name} />
                    <InfoRow label="Roll Number" value={member.rollNumber || "—"} />
                    <InfoRow label="Branch" value={member.branch} />
                    <InfoRow label="Year" value={`Year ${member.year}`} />
                    <InfoRow label="Email" value={member.email} />
                  </>
                )}
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
