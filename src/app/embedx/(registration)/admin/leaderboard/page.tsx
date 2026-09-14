"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

interface Team {
  _id?: string;
  id?: string;
  name: string;
  score: number;
}

export default function AdminLeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/embedx/leaderboard?t=${Date.now()}`, { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (response.ok) {
          const data = await response.json();
          setTeams(data.teams || data || []);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const passkey = localStorage.getItem("embedx_admin_passkey") || "";
        const response = await fetch('/api/embedx/admin/settings', {
          headers: { "x-admin-password": passkey },
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.settings && data.settings.leaderboard_hidden) {
            setIsHidden(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchLeaderboard();
    fetchSettings();
  }, []);

  const toggleHidden = async () => {
    setIsUpdating(true);
    try {
      const passkey = localStorage.getItem("embedx_admin_passkey") || "";
      const response = await fetch('/api/embedx/admin/settings', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "x-admin-password": passkey 
        },
        body: JSON.stringify({ key: 'leaderboard_hidden', value: !isHidden })
      });
      if (response.ok) {
        setIsHidden(!isHidden);
      } else {
        alert("Failed to update leaderboard visibility. Please check admin passkey.");
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
      alert("Error updating settings.");
    } finally {
      setIsUpdating(false);
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="embedx-page-bg" style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
            Embed<span className="neon-text">X</span> Live Rankings
          </h1>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button 
              onClick={toggleHidden}
              disabled={isUpdating}
              style={{ 
                background: isHidden ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", 
                border: isHidden ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(34,197,94,0.4)", 
                color: isHidden ? "#f87171" : "#4ade80", 
                padding: "0.5rem 1rem", 
                borderRadius: "0.5rem", 
                cursor: isUpdating ? "wait" : "pointer", 
                fontSize: "0.85rem", 
                fontWeight: 600, 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.4rem", 
                opacity: isUpdating ? 0.7 : 1
              }}
            >
              {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
              {isUpdating ? "Updating..." : isHidden ? "Leaderboard Hidden" : "Hide Leaderboard"}
            </button>
            <Link 
              href="/embedx/admin"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.75rem", marginBottom: "0.5rem", borderBottom: "1px solid rgba(59,130,246,0.3)", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "var(--font-space-grotesk)" }}>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div style={{ width: "3rem" }}>Rank</div>
              <div>Team Name</div>
            </div>
            <div>Score</div>
          </div>

          {isLoading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#38bdf8" }}>Loading Rankings...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {sortedTeams.map((team, idx) => {
                let rankDisplay: React.ReactNode = (idx + 1).toString();
                if (team.score === 0) rankDisplay = "-";
                else if (idx === 0) rankDisplay = <span style={{ color: "#fbbf24" }}>#1</span>;
                else if (idx === 1) rankDisplay = <span style={{ color: "#d4d4d8" }}>#2</span>;
                else if (idx === 2) rankDisplay = <span style={{ color: "#ea580c" }}>#3</span>;
                else rankDisplay = `#${idx + 1}`;

                const key = team._id || team.id || `team-${idx}`;

                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0.5rem", borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                      <div style={{ width: "3rem", color: "#94a3b8", fontWeight: 700, fontFamily: "monospace", fontSize: "1rem" }}>{rankDisplay}</div>
                      <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "1rem" }}>{team.name}</div>
                    </div>
                    <div style={{ color: "#38bdf8", fontWeight: 700, fontFamily: "monospace", fontSize: "1rem" }}>{team.score.toLocaleString()}</div>
                  </div>
                );
              })}
              {sortedTeams.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No teams ranked yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
