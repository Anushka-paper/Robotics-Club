import { useEffect, useRef, type RefObject } from "react";

const IMAGES = [
  "/bg_frame_1.jpg",
  "/bg_frame_2.jpg",
  "/bg_frame_3.jpg",
  "/bg_frame_4.jpg",
  "/bg_frame_5.jpg",
  "/bg_frame_6.jpg",
  "/bg_frame_7.jpg",
];

export default function CinematicBackground({ scroll }: { scroll: RefObject<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const images = containerRef.current?.querySelectorAll("img.bg-layer");
    if (!images) return;

    const render = () => {
      const progress = scroll.current || 0;
      const frameProgress = progress * 6.0;

      images.forEach((img, index) => {
        // Linear crossfade based on distance to the current frame index
        const distance = Math.abs(frameProgress - index);
        const opacity = Math.max(0, 1 - distance);
        (img as HTMLImageElement).style.opacity = opacity.toString();
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [scroll]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0e0f12]" ref={containerRef}>
      
      {/* 7 Cinematic Image Layers */}
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Cinematic Environment ${i + 1}`}
          loading={i === 0 ? "eager" : "lazy"}
          className="bg-layer absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === 0 ? 1 : 0,
            willChange: "opacity",
            filter: "blur(2px) brightness(0.65) contrast(1.1) saturate(0.6)",
          }}
        />
      ))}

      {/* Cinematic Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(10, 10, 12, 0.8) 100%)"
        }}
      />

      {/* Text Readability Gradient (Left and Right edges darkened) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.65) 100%)"
        }}
      />

      {/* Subtle Cinematic Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
