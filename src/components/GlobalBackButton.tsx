"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GlobalBackButton() {
  const pathname = usePathname();

  // Do not show on the home page
  if (pathname === "/") return null;

  return (
    <Link
      href="/?skip=true"
      className="fixed top-4 left-4 md:top-8 md:left-8 z-[9999] flex items-center gap-2 rounded-lg bg-black/40 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono transition-colors hover:text-white backdrop-blur-md border border-white/10"
      style={{ textDecoration: "none" }}
    >
      <ArrowLeft size={14} /> Back
    </Link>
  );
}
