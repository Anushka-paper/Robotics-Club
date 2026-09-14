import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "../index.css";
import GlobalBackButton from "@/components/GlobalBackButton";

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
  title: "Robotics Club MMMUT",
  description:
    "Robotics Club at MMMUT — the build club for first-year engineers. Real hardware from week one.",
  keywords: ["Robotics Club MMMUT", "EmbedX", "MMMUT", "Robotics", "Embedded Systems"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <GlobalBackButton />
        {children}
      </body>
    </html>
  );
}
