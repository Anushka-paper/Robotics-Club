import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export const LinkPreview = ({
  children,
  url,
  className,
  width = 240,
  height = 160,
}: {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const targetRect = e.currentTarget.getBoundingClientRect();
    const eventOffsetX = e.clientX - targetRect.left;
    const offsetFromCenter = eventOffsetX - targetRect.width / 2; 
    x.set(offsetFromCenter);
  };

  // Microlink screenshot generator for dynamic hover previews
  const encodedUrl = encodeURIComponent(url);
  const src = `https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=${width}&viewport.height=${height}`;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onMouseMove={handleMouseMove}
      className={`relative inline-block ${className || ""}`}
    >
      <AnimatePresence>
        {isOpen && isMounted && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            exit={{ opacity: 0, y: 15, scale: 0.8, transition: { duration: 0.1 } }}
            className="absolute shadow-2xl rounded-xl z-50 pointer-events-none"
            style={{
              x: translateX,
              left: "50%",
              top: "-15px",
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="block rounded-xl border border-[#3b82f6]/50 bg-[#0a1120] p-1 shadow-[0_10px_40px_rgba(59,130,246,0.3)]">
              <div 
                className="rounded-lg overflow-hidden bg-[#070b14]"
                style={{ width, height }}
              >
                <img
                  src={src}
                  alt="Preview"
                  width={width}
                  height={height}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};
