"use client";

import { useState } from "react";
import { X, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Banner1() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      role="banner"
      aria-label="Promotion announcement"
      className="relative flex items-center bg-neutral-950 py-3 pr-8 pl-6"
    >
      <Link
        href="/embedx/register"
        className="flex w-full cursor-pointer items-start justify-start gap-2 md:items-center md:justify-center"
        aria-label="Get Internship Opportunities"
      >
        <p className="text-left text-sm text-white hover:underline md:text-center">
          <span className="font-semibold">Get Internship Opportunities!</span>
        </p>
        <ChevronsRight className="hidden h-4 w-4 text-white md:block" />
      </Link>

      <Button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/20"
        aria-label="Close announcement"
        variant="ghost"
        size="icon"
      >
        <X className="text-white" />
        <span className="sr-only">Close</span>
      </Button>
    </aside>
  );
}

export default Banner1;
