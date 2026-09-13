import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function EmbedxCard() {
  const router = useRouter();

  // --- 3D Tilt Animation Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Subtle tilt limits for a wide horizontal banner
  const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const xPct = (e.clientX - left) / width - 0.5;
    const yPct = (e.clientY - top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="w-full max-w-[550px] pointer-events-auto group"
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full"
      >
        <div 
          className="flex items-center text-red-500 text-[10px] md:text-[11px] font-bold tracking-[0.2em] mb-2 uppercase font-['Inter'] px-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="relative flex h-2.5 w-2.5 mr-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          LIVE
        </div>
        
        <div 
          className="relative w-full rounded-2xl overflow-hidden bg-[#070b14] border border-[#1e3a5f]/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#3b82f6]/50 hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          
          {/* Background Image - Spans the entire full width and height of the banner */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-[center_35%] bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: "url('/embedx-chip-bg.jpg')", transform: "translateZ(-10px)" }}
          />

          {/* Strong gradient on the left for text readability, but semi-transparent so the background is visible everywhere */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/60 to-transparent" style={{ transform: "translateZ(0px)" }} />
          <div className="absolute inset-0 bg-[#070b14]/30" style={{ transform: "translateZ(0px)" }} /> {/* Subtle overall darkening */}

          {/* Card Content Layout */}
          <div 
            className="relative z-10 flex flex-col md:flex-row p-4 md:px-6 md:py-5 h-full w-full min-h-[140px] md:min-h-[160px] justify-between items-start md:items-center gap-3 md:gap-4"
            style={{ transform: "translateZ(20px)" }}
          >
            
            {/* Left Column: Text */}
            <div className="flex flex-col flex-1 max-w-[280px]">
              <h3 className="text-xl md:text-2xl font-black tracking-wide mb-1 font-['Space_Grotesk'] flex items-center">
                <span className="text-white">EMBED</span>
                <span className="text-[#3b82f6]">X</span>
              </h3>
              
              <div className="text-[#a1a1aa] text-[8px] tracking-[0.2em] uppercase mb-2 font-bold">
                BUILD &middot; CREATE &middot; INNOVATE
              </div>

              <p className="text-[#d4d4d8] text-[10px] md:text-[11px] leading-snug font-medium">
                Build hardware. Solve real-world problems. Turn your ideas into working prototypes.
              </p>
            </div>

            {/* Right Column: Button */}
            <div className="flex-shrink-0 mt-2 md:mt-0" style={{ transform: "translateZ(30px)" }}>
              <button 
                onClick={() => router.push("/embedx/register")}
                className="group/btn relative overflow-hidden bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2.5 rounded-md font-bold text-[12px] md:text-[13px] transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] whitespace-nowrap"
              >
                <span className="relative z-10 font-['Inter']">Register Now</span>
                <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                  &rarr;
                </span>
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
