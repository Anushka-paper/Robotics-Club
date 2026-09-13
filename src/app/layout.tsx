import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EmbedX Registration | Robotics Club MMMUT",
  description:
    "Register your team for EmbedX — the Robotics & Embedded Systems flagship event organized by Robotics Club, Madan Mohan Malaviya University of Technology, Gorakhpur.",
  keywords: ["EmbedX", "Robotics Club MMMUT", "Embedded Systems", "Registration", "MMMUT"],
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ background: "#030b18" }}
      >
        {/* Navbar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(3, 11, 24, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0, 240, 255, 0.08)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0.75rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Image
                src="/images/rc-logo.png"
                alt="Robotics Club MMMUT"
                width={36}
                height={36}
                style={{ objectFit: "contain", filter: "brightness(1.1)" }}
                priority
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "#f0f6ff",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  Robotics Club
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "#475569",
                    letterSpacing: "0.04em",
                    lineHeight: 1.3,
                  }}
                >
                  MMMUT, Gorakhpur
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.75rem",
                background: "rgba(0, 240, 255, 0.06)",
                border: "1px solid rgba(0, 240, 255, 0.15)",
                borderRadius: "999px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#00f0ff",
                  boxShadow: "0 0 6px rgba(0, 240, 255, 0.6)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#00f0ff",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                EMBED<strong>X</strong> Registration
              </span>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(0, 240, 255, 0.06)",
            padding: "1.5rem 1.25rem",
            textAlign: "center",
            color: "#334155",
            fontSize: "0.8125rem",
          }}
        >
          © 2026 Robotics Club, Madan Mohan Malaviya University of Technology, Gorakhpur. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
