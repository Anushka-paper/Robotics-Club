"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import logo from "../assets/club-logo.png";
import logoNoBg from "../assets/club-logo-nobg.png";
import { ShaderBackground } from "./ui/adisyon-shader";

interface RobotLoaderProps {
  onComplete: () => void;
}

export default function RobotLoader({ onComplete }: RobotLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Background animation refs
  const bgBlueprintRef = useRef<HTMLDivElement>(null);
  const bgMechanicsRef = useRef<HTMLDivElement>(null);
  const bgCircuitsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Logo animation refs
  const spinRingRef = useRef<SVGCircleElement>(null);
  const logoOverlayRef = useRef<HTMLImageElement>(null);
  const liquidContainerRef = useRef<HTMLDivElement>(null);
  const waveBackRef = useRef<SVGPathElement>(null);
  const waveFrontRef = useRef<SVGPathElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const punchlineRef = useRef<HTMLDivElement>(null);
  
  const statusLineRef = useRef<HTMLDivElement>(null);
  const statusTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(bgBlueprintRef.current, { x: x * 15, y: y * 15, duration: 1, ease: "power2.out" });
      gsap.to(bgMechanicsRef.current, { x: x * -20, y: y * -20, duration: 1, ease: "power2.out" });
      gsap.to(bgCircuitsRef.current, { x: x * 10, y: y * 10, duration: 1, ease: "power2.out" });
      gsap.to(logoContainerRef.current, { x: x * -10, y: y * -10, rotationX: y * 5, rotationY: x * 5, duration: 1, ease: "power2.out" });
    };
    document.addEventListener("mousemove", handleMouseMove);

    // Canvas Particles
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    class Particle {
      x!: number; y!: number; size!: number; speedY!: number; speedX!: number; opacity!: number;
      constructor() { this.reset(); this.y = Math.random() * height; }
      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = -(Math.random() * 1 + 0.5);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx!.fillStyle = `rgba(244, 197, 13, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    const particles = Array.from({ length: 60 }, () => new Particle());

    let wavePhaseF = 0, wavePhaseB = 0;
    
    const tick = () => {
      // Particles
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });

      // Waves
      wavePhaseF += 0.05;
      wavePhaseB += 0.03;
      const genWave = (phase: number, amp: number, yOffset: number) => {
        let d = `M0,${yOffset}`;
        for (let x = 0; x <= 800; x += 20) {
          let y = yOffset + Math.sin((x / 800) * Math.PI * 4 + phase) * amp;
          d += ` L${x},${y}`;
        }
        d += ` V100 H0 Z`;
        return d;
      };
      if (waveFrontRef.current) waveFrontRef.current.setAttribute('d', genWave(wavePhaseF, 10, 50));
      if (waveBackRef.current) waveBackRef.current.setAttribute('d', genWave(wavePhaseB, 15, 45));
    };
    gsap.ticker.add(tick);

    // Initial states
    gsap.set(spinRingRef.current, { rotation: 0, transformOrigin: "center" });
    gsap.to(spinRingRef.current, { rotation: 360, duration: 4, repeat: -1, ease: "none" });
    
    // Set 3D perspective
    gsap.set(logoContainerRef.current, { transformPerspective: 1000 });

    const tl = gsap.timeline({ delay: 0.5 }).timeScale(1.4);

    const updateStatus = (text: string, progress: number) => {
      tl.to(statusTextRef.current, { opacity: 0, duration: 0.2, y: -5 })
        .add(() => {
          if (statusTextRef.current) statusTextRef.current.textContent = text;
        })
        .to(statusTextRef.current, { opacity: 1, duration: 0.2, y: 0 })
        .to(statusLineRef.current, { width: `${progress}%`, duration: 0.4, ease: "power2.out" }, "<");
    };

    // Fade in background smoothly
    tl.to([bgBlueprintRef.current, bgMechanicsRef.current, bgCircuitsRef.current], { opacity: 1, duration: 2, stagger: 0.2, ease: "power2.inOut" }, 0);

    // Panel 1: Initializing
    updateStatus("INITIALIZING SYSTEM...", 20);
    tl.to({}, { duration: 1.0 });

    // Panel 2: Revealing Logo
    updateStatus("CALIBRATING INTERFACE...", 40);
    tl.fromTo(logoOverlayRef.current, 
      { opacity: 0, scale: 0.8, filter: "blur(10px) brightness(2)" },
      { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", duration: 1.2, ease: "elastic.out(1, 0.7)" }
    );
    // Restore the robotic glitch effect!
    tl.to(logoOverlayRef.current, { x: 4, skewX: 2, filter: "hue-rotate(90deg)", duration: 0.05, yoyo: true, repeat: 3 })
      .to(logoOverlayRef.current, { x: -4, skewX: -2, filter: "invert(1)", duration: 0.05, yoyo: true, repeat: 3 }, "+=0.1")
      .set(logoOverlayRef.current, { x: 0, skewX: 0, filter: "none" });

    // Fade in punchline shortly after logo starts revealing
    tl.to(punchlineRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "<0.5");

    // Panel 3: RC Visible
    updateStatus("MODULES SYNCHRONIZED...", 50);
    tl.to({}, { duration: 0.6 });

    // Panel 4, 5, 6: Liquid Flow (smooth and engineered)
    updateStatus("COMMENCING BOOT SEQUENCE...", 60);
    
    // Liquid rises from 105% to 0%
    tl.to(liquidContainerRef.current, { y: "0%", duration: 3.5, ease: "power2.inOut" }, "-=0.5");

    tl.add(() => updateStatus("STABILIZING...", 75), "-=2.5");
    tl.add(() => updateStatus("OPTIMIZING OUTPUT...", 90), "-=1.0");

    // Panel 7: Final Fill
    updateStatus("SYSTEM READY", 98);
    tl.to({}, { duration: 0.5 });

    // Panel 8: Loading Complete
    updateStatus("BOOT COMPLETE", 100);
    
    tl.to(statusTextRef.current, { opacity: 0, duration: 0.3, delay: 0.5, y: -5 })
      .add(() => {
        if (statusTextRef.current) statusTextRef.current.textContent = "ACCESSING MAINFRAME...";
      })
      .to(statusTextRef.current, { opacity: 1, duration: 0.3, y: 0 })
      // Restore final power surge
      .to(logoOverlayRef.current, { scale: 1.05, filter: "drop-shadow(0 0 20px rgba(255,215,0,0.8))", duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }, "<");

    // Transition to website
    tl.to(containerRef.current, { opacity: 0, duration: 1.2, ease: "power3.inOut", delay: 0.5 })
      .add(() => {
        document.body.style.overflow = "";
        gsap.ticker.remove(tick);
        document.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        onComplete();
      });

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#030304] font-sans flex flex-col items-center justify-center z-[9999] overflow-hidden">
      <style>{`
        .bg-gradient-vignette { background: radial-gradient(circle at center, transparent 0%, #020202 100%); }
        .bg-cad-grid {
          background-image: 
            linear-gradient(rgba(244, 197, 13, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(244, 197, 13, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(244, 197, 13, 0.02) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(244, 197, 13, 0.02) 1px, transparent 1px);
          background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
          background-position: center;
          mask-image: radial-gradient(ellipse at center, transparent 10%, black 100%);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 10%, black 100%);
        }
      `}</style>

      {/* Website Shader Background (Subtle link to main site) */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none">
        <ShaderBackground className="w-full h-full" />
      </div>

      {/* BACKGROUND SYSTEMS (CAD/Engineering focus) */}
      <div className="absolute inset-0 z-[1] bg-gradient-vignette pointer-events-none">
        
        {/* Layer 1: Blueprint Arm */}
        <div ref={bgBlueprintRef} className="absolute inset-[-5%] w-[110%] h-[110%] flex items-center justify-center opacity-0 scale-110 -translate-x-[10%]">
          <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M-50,650 L150,450 L350,400 L450,200 L600,150 L650,50" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="10 5" opacity="0.04" />
            <circle cx="150" cy="450" r="30" fill="none" stroke="#fff" strokeWidth="4" opacity="0.04" />
            <circle cx="350" cy="400" r="20" fill="none" stroke="#fff" strokeWidth="3" opacity="0.04" />
            <circle cx="450" cy="200" r="25" fill="none" stroke="#fff" strokeWidth="3" opacity="0.04" />
            <g fill="#fff" opacity="0.04">
              <circle cx="200" cy="300" r="2"/><circle cx="500" cy="400" r="2"/><circle cx="600" cy="300" r="2"/>
              <circle cx="100" cy="200" r="2"/><circle cx="300" cy="100" r="2"/><circle cx="700" cy="500" r="2"/>
            </g>
          </svg>
        </div>
        
        {/* Layer 2: Mechanical Concentric Rings */}
        <div ref={bgMechanicsRef} className="absolute inset-[-5%] w-[110%] h-[110%] flex items-center justify-center opacity-0">
          <svg viewBox="0 0 1000 1000" className="w-full h-full opacity-10">
            <circle cx="500" cy="500" r="300" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="4 12" />
            <circle cx="500" cy="500" r="380" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="100 20 10 20" />
            <circle cx="500" cy="500" r="450" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2 6" />
          </svg>
        </div>

        {/* Layer 3: Circuit Grid */}
        <div ref={bgCircuitsRef} className="absolute inset-[-5%] w-[110%] h-[110%] bg-cad-grid opacity-0"></div>

        {/* Canvas Particles */}
        <canvas ref={canvasRef} className="absolute inset-0 opacity-0"></canvas>
      </div>

      {/* Central Logo Assembly */}
      <div ref={logoContainerRef} className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] z-[10]">
        
        {/* Dashed spinning ring */}
        <svg className="absolute inset-0 w-full h-full overflow-visible opacity-50" viewBox="0 0 400 400">
          <circle 
            ref={spinRingRef} 
            cx="200" cy="200" r="190" 
            fill="none" stroke="#FFD700" strokeWidth="2" 
            strokeDasharray="150 50 50 50" 
            style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.5))" }}
          />
        </svg>

        {/* Liquid Masked Container */}
        <div 
          className="absolute inset-[2%] rounded-full overflow-hidden"
          style={{ 
            WebkitMaskImage: `url(${logo.src})`, 
            WebkitMaskSize: 'contain', 
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: `url(${logo.src})`, 
            maskSize: 'contain',
            maskPosition: 'center',
            maskRepeat: 'no-repeat'
          }}
        >
          {/* White Liquid Env */}
          <div ref={liquidContainerRef} className="absolute bottom-0 left-0 w-full h-full translate-y-[105%] bg-white">
            <svg className="absolute bottom-[99%] left-0 w-[200%] h-[15%] text-[#e0e0e0] opacity-80" preserveAspectRatio="none" viewBox="0 0 800 100">
              <path ref={waveBackRef} fill="currentColor" d="M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 V100 H0 Z" />
            </svg>
            <svg className="absolute bottom-[99%] left-0 w-[200%] h-[15%] text-white" preserveAspectRatio="none" viewBox="0 0 800 100">
              <path ref={waveFrontRef} fill="currentColor" d="M0,50 Q100,80 200,50 T400,50 T600,50 T800,50 V100 H0 Z" />
            </svg>
          </div>
          
          {/* Base Logo with transparent background sits on top of the liquid */}
          <img 
            ref={logoOverlayRef} 
            src={logoNoBg.src} 
            className="absolute inset-0 w-full h-full object-contain opacity-0" 
            alt="Logo" 
          />
        </div>

      </div>

      {/* PUNCHLINE */}
      <div 
        ref={punchlineRef}
        className="mt-8 text-[#FFD700] tracking-[10px] text-[11px] md:text-[13px] font-bold font-mono opacity-0 translate-y-4 z-[10]"
        style={{ textShadow: "0 0 12px rgba(255,215,0,0.4)" }}
      >
        ENGINEERING THE FUTURE
      </div>

      {/* Progress Bar & Status Text underneath */}
      <div className="mt-12 w-[250px] flex flex-col items-center z-[10]">
        <div className="w-full h-[2px] bg-[#222] relative overflow-hidden mb-4">
          <div ref={statusLineRef} className="absolute left-0 top-0 h-full w-[0%] bg-[#FFD700]" style={{ boxShadow: "0 0 8px #FFD700" }}></div>
        </div>
        <div className="h-[20px] overflow-hidden relative w-full text-center">
          <div ref={statusTextRef} className="text-[#FFD700] text-[10px] tracking-[4px] uppercase opacity-0 font-medium font-mono"></div>
        </div>
      </div>

    </div>
  );
}
