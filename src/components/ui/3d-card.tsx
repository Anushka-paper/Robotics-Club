"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveTravelCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  actionText: string;
  href: string;
  onActionClick: () => void;
  className?: string;
  topLabel?: string;
}

export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    { title, subtitle, imageUrl, actionText, href, onActionClick, className, topLabel },
    ref
  ) => {
    // --- 3D Tilt Animation Logic ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      const mouseXVal = e.clientX - left;
      const mouseYVal = e.clientY - top;
      const xPct = mouseXVal / width - 0.5;
      const yPct = mouseYVal / height - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onActionClick}
        whileHover="hover"
        variants={{
          hover: { y: -8 }
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-[380px] w-[300px] md:h-[400px] md:w-[320px] rounded-xl bg-transparent shadow-2xl border border-white/5 transition-colors duration-300 cursor-pointer",
          className
        )}
      >
        <div
          style={{
            transform: "translateZ(30px)",
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-4 grid h-[calc(100%-2rem)] w-[calc(100%-2rem)] grid-rows-[1fr_auto] rounded-xl shadow-lg overflow-hidden group"
        >
          {/* Background Image */}
          <motion.img
            src={imageUrl}
            alt={`${title}, ${subtitle}`}
            variants={{
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          
          {/* Darkening overlay for better text contrast over the image */}
          <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-black/40 via-transparent to-[#0e0f12]/90 pointer-events-none" />

          {/* Card Content (Header & Footer) */}
          <div className="relative flex flex-col justify-between p-6 text-white h-full pointer-events-none">
            
            {/* Header section with text and link */}
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col">
                {topLabel && (
                  <motion.span 
                    style={{ transform: "translateZ(40px)" }}
                    className="text-[10px] font-semibold tracking-[0.2em] text-[#f5a524] mb-2 font-['Inter'] uppercase"
                  >
                    {topLabel}
                  </motion.span>
                )}
                <motion.h2 
                  style={{ transform: "translateZ(50px)" }}
                  className="text-2xl font-bold font-['Space_Grotesk'] leading-tight"
                >
                  {title}
                </motion.h2>
                <motion.p 
                  style={{ transform: "translateZ(30px)" }}
                  className="text-sm font-light text-white/70 font-['Inter'] mt-1"
                >
                  {subtitle}
                </motion.p>
              </div>
              <motion.a
                href={href}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onActionClick(); }}
                variants={{
                  hover: { scale: 1.1, rotate: "15deg", backgroundColor: "rgba(255,255,255,0.2)" }
                }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-label={`Learn more about ${title}`}
                style={{ transform: "translateZ(60px)" }}
                className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 transition-colors"
              >
                <ArrowUpRight className="h-5 w-5 text-white" />
              </motion.a>
            </div>

            {/* Footer Button */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); onActionClick(); }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              style={{ transform: "translateZ(40px)" }}
              className={cn(
                "pointer-events-auto mt-auto flex items-center gap-2 py-3 text-sm font-medium text-white transition-colors font-['Inter'] group/btn w-fit"
              )}
            >
              <span className="border-b border-transparent group-hover/btn:border-[#f5a524] transition-colors pb-0.5">
                {actionText}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
);
InteractiveTravelCard.displayName = "InteractiveTravelCard";
