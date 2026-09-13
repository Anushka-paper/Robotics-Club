"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/embedx/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId, email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid registration ID or leader email.");
        return;
      }

      router.push("/embedx/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="embedx-page-bg" style={{ minHeight: "calc(100dvh - 120px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "520px", padding: "2rem", animation: "fade-in-up 0.5s ease" }}>
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#38bdf8", fontWeight: 700 }}>
            EmbedX Dashboard
          </div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2rem, 4vw, 2.5rem)", color: "#f8fafc", margin: "0.75rem 0 0.35rem" }}>
            Welcome Back
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Access your registration dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <label style={{ display: "grid", gap: "0.45rem", color: "#cbd5e1", fontSize: "0.875rem" }}>
            Registration ID
            <input
              type="text"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              placeholder="EMBX-2026-AB12"
              autoComplete="off"
              style={{
                width: "100%",
                background: "rgba(3, 11, 24, 0.7)",
                border: "1px solid rgba(0, 240, 255, 0.15)",
                borderRadius: "0.55rem",
                padding: "0.75rem 0.875rem",
                fontSize: "0.9375rem",
                color: "#f0f6ff",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "0.45rem", color: "#cbd5e1", fontSize: "0.875rem" }}>
            Leader Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="leader@example.com"
              autoComplete="email"
              style={{
                width: "100%",
                background: "rgba(3, 11, 24, 0.7)",
                border: "1px solid rgba(0, 240, 255, 0.15)",
                borderRadius: "0.55rem",
                padding: "0.75rem 0.875rem",
                fontSize: "0.9375rem",
                color: "#f0f6ff",
                outline: "none",
              }}
            />
          </label>

          {error ? (
            <div
              style={{
                border: "1px solid rgba(239, 68, 68, 0.45)",
                background: "rgba(127, 29, 29, 0.2)",
                color: "#fecaca",
                borderRadius: "0.55rem",
                padding: "0.75rem 0.875rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          ) : null}

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", opacity: loading ? 0.75 : 1 }}>
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          Not registered yet? {" "}
          <Link href="/embedx/register" style={{ color: "#38bdf8", textDecoration: "none" }}>
            Register your team
          </Link>
        </p>
      </div>
    </div>
  );
}
