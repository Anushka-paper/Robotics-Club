"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, AlertTriangle, Copy, Check } from "lucide-react";
import { EMBEDX_CONFIG } from "@/config/embedx";
import type { MemberItem } from "@/lib/db";

interface RegistrationDetail {
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
  editLogs?: { timestamp: string; editedBy: string; changes: string }[];
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const cfg =
    EMBEDX_CONFIG.status.registration[
      status as keyof typeof EMBEDX_CONFIG.status.registration
    ] || EMBEDX_CONFIG.status.registration.PENDING;

  return (
    <span
      className={cfg.bg}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.3rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.8125rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
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
      className={cfg.bg}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.2rem 0.625rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
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

function EditRow({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (val: string) => void; type?: string }) {
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

export default function AdminRegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const registrationId = params.registrationId as string;

  const [data, setData] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{ teamName: string; memberCount: number }>({ teamName: "", memberCount: 1 });
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    if (!data) return;
    setEditData({ teamName: data.teamName, memberCount: data.memberCount });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!data) return;
    const passkey = localStorage.getItem("embedx_admin_passkey") || "";
    setIsSaving(true);
    try {
      const res = await fetch(`/api/embedx/admin/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": passkey,
        },
        body: JSON.stringify(editData),
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setIsEditing(false);
      } else {
        alert(json.error || "Failed to save edits.");
      }
    } catch {
      alert("Failed to save edits.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const passkey = localStorage.getItem("embedx_admin_passkey");
    if (!passkey) {
      router.replace("/embedx/admin");
      return;
    }
    setIsSuperAdmin(localStorage.getItem("embedx_admin_role") === "super");

    if (!registrationId) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/embedx/admin/registrations/${registrationId}`, {
          headers: { "x-admin-password": passkey },
        });
        const json = await res.json();

        if (res.status === 401) {
          router.replace("/embedx/admin");
          return;
        }

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

    fetchDetail();
  }, [registrationId, router]);

  const copyUtr = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 1500);
  };

  const handleDelete = async () => {
    const passkey = localStorage.getItem("embedx_admin_passkey") || "";
    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/embedx/admin/registrations/${registrationId}`, {
        method: "DELETE",
        headers: { "x-admin-password": passkey },
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setDeleteError(json.error || "Failed to delete registration.");
        setIsDeleting(false);
        return;
      }

      router.replace("/embedx/admin");
    } catch {
      setDeleteError("Failed to delete registration. Please try again.");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="embedx-page-bg" style={{ minHeight: "calc(100dvh - 120px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#475569", fontSize: "0.875rem" }}>Loading registration...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="embedx-page-bg" style={{ minHeight: "calc(100dvh - 120px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
        <div className="glass-card" style={{ padding: "2rem", maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-space-grotesk)", color: "#f0f6ff", fontWeight: 700, marginBottom: "0.5rem" }}>
            Registration Not Found
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            {error || "We could not find a registration with this ID."}
          </p>
          <Link href="/embedx/admin">
            <button className="btn-secondary">Back to Admin</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="embedx-page-bg" style={{ padding: "2rem 1.25rem", minHeight: "calc(100dvh - 120px)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }} className="animate-fade-in-up">
        <Link
          href="/embedx/admin"
          className="btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Admin</span>
        </Link>

        <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.25rem", position: "relative" }}>
            <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
              {!isEditing ? (
                <button onClick={startEditing} style={{ background: "none", border: "1px solid rgba(56,189,248,0.4)", borderRadius: "0.25rem", color: "#38bdf8", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer", transition: "all 0.2s" }} className="hover:bg-sky-500/10">
                  Edit Details
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => setIsEditing(false)} disabled={isSaving} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.25rem", color: "#e2e8f0", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} style={{ background: "rgba(56,189,248,0.2)", border: "1px solid rgba(56,189,248,0.5)", borderRadius: "0.25rem", color: "#38bdf8", padding: "0.25rem 0.6rem", fontSize: "0.75rem", cursor: "pointer" }}>
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 800, color: "#00f0ff", letterSpacing: "0.05em" }}>
                {data.registrationId}
              </div>
              
              {!isEditing ? (
                <div style={{ fontSize: "1.375rem", fontWeight: 700, color: "#f0f6ff", marginTop: "0.25rem" }}>
                  {data.teamName}
                </div>
              ) : (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <EditRow label="Team Name" value={editData.teamName} onChange={val => setEditData({ ...editData, teamName: val })} />
                  <EditRow label="Member Count" value={editData.memberCount} onChange={val => setEditData({ ...editData, memberCount: parseInt(val) || 1 })} type="number" />
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: isEditing ? "1rem" : 0 }}>
              <StatusBadge status={data.registrationStatus} />
              <PaymentBadge status={data.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
          <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.5rem" }}>
            Team Leader
          </h3>
          <InfoRow label="Name" value={data.leaderName} />
          <InfoRow label="Roll Number" value={data.leaderRollNumber || "—"} />
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
                <InfoRow label="Email" value={member.email || "—"} />
              </div>
            ))}
          </div>
        )}

        <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
          <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "0.5rem" }}>
            Payment Details
          </h3>
          <InfoRow
            label="UTR / Txn ID"
            value={
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "monospace", color: "#7dd3fc", fontWeight: 600 }}>
                {data.utr}
                <button
                  onClick={copyUtr}
                  style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", display: "inline-flex", padding: 0 }}
                  aria-label="Copy UTR"
                >
                  {copiedUtr ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </span>
            }
          />
          <InfoRow
            label="Screenshot"
            value={
              <a href={data.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8" }}>
                View full-size receipt &rarr;
              </a>
            }
          />
          <InfoRow label="Submitted" value={new Date(data.createdAt).toLocaleString("en-IN")} />
        </div>

        {data.paymentScreenshotUrl && (
          <div className="glass-card" style={{ padding: "1rem", marginBottom: "1.25rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.paymentScreenshotUrl}
              alt="Payment receipt"
              style={{ maxWidth: "100%", borderRadius: "0.5rem", display: "block", margin: "0 auto" }}
            />
          </div>
        )}

        {/* ── Edit Logs ── */}
        {data.editLogs && data.editLogs.length > 0 && (
          <div className="glass-card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#38bdf8", marginBottom: "1rem" }}>
              Edit History
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {data.editLogs.slice().reverse().map((log, idx) => (
                <div key={idx} style={{ padding: "0.75rem", background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#e2e8f0" }}>
                      Edited by: {log.editedBy}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "#64748b" }}>
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                    {log.changes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Danger zone (super admin only) ── */}
        {isSuperAdmin && (
        <div
          className="glass-card"
          style={{
            padding: "1.25rem 1.5rem",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            background: "rgba(239, 68, 68, 0.04)",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#f87171", marginBottom: "0.75rem" }}>
            Danger Zone
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.8125rem", marginBottom: "1rem", lineHeight: 1.6 }}>
            Permanently delete this team&apos;s registration. This cannot be undone — their registration ID, payment record, and receipt will be removed entirely.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.625rem 1.25rem",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "0.5rem",
                color: "#f87171",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              <Trash2 size={16} />
              Delete This Team
            </button>
          ) : (
            <div
              style={{
                padding: "1rem",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "0.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <AlertTriangle size={18} style={{ color: "#f87171", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "#fca5a5", fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.5 }}>
                  This will permanently delete <strong>{data.teamName}</strong> ({data.registrationId}) and cannot be undone.
                  Type <strong>DELETE</strong> below to confirm.
                </p>
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="form-input"
                style={{ marginBottom: "0.75rem" }}
              />
              {deleteError && (
                <p style={{ color: "#f87171", fontSize: "0.8125rem", marginBottom: "0.75rem" }}>{deleteError}</p>
              )}
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== "DELETE" || isDeleting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.625rem 1.25rem",
                    background: confirmText === "DELETE" ? "#dc2626" : "rgba(220, 38, 38, 0.3)",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: confirmText === "DELETE" && !isDeleting ? "pointer" : "not-allowed",
                  }}
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmText("");
                    setDeleteError("");
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
