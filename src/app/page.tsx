import Link from "next/link";
import Image from "next/image";
import { Cpu, Bot, Trophy, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="embedx-page-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 120px)", padding: "2rem 1.25rem" }}>
      <div style={{ maxWidth: "640px", width: "100%", textAlign: "center" }} className="animate-fade-in-up">

        {/* Logo cluster */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          <Image src="/images/rc-logo.png" alt="Robotics Club MMMUT" width={52} height={52} style={{ objectFit: "contain" }} />
          <div style={{ width: "1px", height: "40px", background: "rgba(0,240,255,0.2)" }} />
          <Image src="/images/mmmut-logo.png" alt="MMMUT" width={52} height={52} style={{ objectFit: "contain" }} />
        </div>

        {/* Event heading */}
        <div style={{ marginBottom: "0.5rem", fontSize: "0.75rem", letterSpacing: "3px", textTransform: "uppercase", color: "#38bdf8", fontWeight: 600 }}>
          Robotics Club MMMUT · presents
        </div>
        <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2.75rem, 8vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color: "#f0f6ff", margin: "0 0 0.35rem 0" }}>
          EMBED<span className="neon-text">X</span>
        </h1>
        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.9375rem", color: "#94a3b8", marginBottom: "2.5rem", letterSpacing: "0.05em" }}>
          Robotics &amp; Embedded Systems · Flagship Event 2026
        </p>

        {/* Description card */}
        <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { icon: Cpu, label: "Embedded Systems", sub: "Build. Program. Deploy." },
              { icon: Bot, label: "Robotics", sub: "Design. Automate. Innovate." },
              { icon: Trophy, label: "Team Event", sub: "1 to 3 members" },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.label} style={{ flex: "1 1 150px", padding: "0.875rem", background: "rgba(0,240,255,0.04)", borderRadius: "0.5rem", border: "1px solid rgba(0,240,255,0.08)" }}>
                  <div style={{ fontSize: "1.25rem", marginBottom: "0.35rem", color: "#00f0ff" }}>
                    <IconComp size={24} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#e2e8f0" }}>{item.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>{item.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/embedx/register">
          <button className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem", width: "100%", maxWidth: "320px", fontFamily: "var(--font-space-grotesk)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span>Register Your Team</span>
            <ArrowRight size={18} />
          </button>
        </Link>

        <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "#334155" }}>
          Kit fee required upon registration · Verification by Robotics Club admin
        </p>
      </div>
    </div>
  );
}
