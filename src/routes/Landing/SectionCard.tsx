import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Landing.module.css";

interface SectionCardProps {
  eyebrow?: string;
  title: string;
  body: string;
  tagline?: string;
  microText1?: string;
  microText2?: string;
  showSignalFlow?: boolean;
  showCodeStream?: boolean;
  align?: "left" | "right";
}

export default function SectionCard({ eyebrow, title, body, tagline, microText1, microText2, showSignalFlow, showCodeStream, align = "left" }: SectionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const signalDotRef = useRef<HTMLDivElement>(null);
  const codeStreamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Initial GSAP setup
    gsap.set(el.querySelectorAll(".anim-item"), { 
      opacity: 0, 
      y: 30, 
      filter: "blur(5px)" 
    });

    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1.2,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    if (signalDotRef.current) {
      gsap.fromTo(signalDotRef.current, 
        { x: 0, opacity: 0 },
        { 
          x: 200, 
          opacity: 1, 
          duration: 3, 
          ease: "linear", 
          repeat: -1,
          keyframes: {
            "0%": { opacity: 0 },
            "10%": { opacity: 1 },
            "90%": { opacity: 1 },
            "100%": { opacity: 0 }
          }
        }
      );
    }

    if (codeStreamRef.current) {
      gsap.to(codeStreamRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(el.querySelectorAll(".anim-item"), {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out"
          });
          
          // Very subtle pulse to specific accent words after they appear
          const accents = el.querySelectorAll(`.${styles.accentWord}`);
          if (accents.length > 0) {
            gsap.to(accents, {
              filter: "brightness(1.2)",
              textShadow: "0 0 35px rgba(244, 197, 13, 0.25)",
              duration: 0.8,
              yoyo: true,
              repeat: 1,
              delay: 1.2,
              ease: "power2.out"
            });
          }

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Format title to handle yellow accents if needed
  let formattedTitle = title.replace("LIFE.", `<span class="${styles.accentWord}">LIFE.</span>`);
  formattedTitle = formattedTitle.replace("ROBOT.", `<span class="${styles.accentWord}">ROBOT.</span>`);
  formattedTitle = formattedTitle.replace("TO MOTION.", `<span class="${styles.accentWord}">TO MOTION.</span>`);
  formattedTitle = formattedTitle.replace("YOUR\u00A0BUILD.", `<span class="${styles.accentWord}">YOUR\u00A0BUILD.</span>`);
  formattedTitle = formattedTitle.replace("BEHAVIOR.", `<span class="${styles.accentWord}">BEHAVIOR.</span>`);
  formattedTitle = formattedTitle.replace("DOESN'T\u00A0END.", `<span class="${styles.accentWord}">DOESN'T\u00A0END.</span>`);

  return (
    <div className={`${styles.card} ${align === 'right' ? 'ml-auto' : ''}`} ref={cardRef}>
      {/* Optional dark readability gradient for sections */}
      <div 
        className={`absolute inset-y-0 ${align === 'right' ? 'right-0' : 'left-0'} w-[150%] pointer-events-none z-[-1]`}
        style={{ 
          background: align === 'right' 
            ? 'linear-gradient(-90deg, rgba(5,5,5,0.8) 0%, rgba(10,10,10,0.4) 60%, transparent 100%)'
            : 'linear-gradient(90deg, rgba(5,5,5,0.8) 0%, rgba(10,10,10,0.4) 60%, transparent 100%)'
        }}
      />
      
      {/* Subtle Micro-Text */}
      {(microText1 || microText2) && (
        <div className={`absolute top-[60vh] ${align === 'right' ? 'left-[-15vw]' : 'right-[-20vw]'} flex flex-col pointer-events-none hidden lg:flex`}>
          {microText1 && (
            <div className="font-sans text-[10px] font-medium tracking-[0.12em] text-white/20 uppercase mb-[40vh] whitespace-pre-wrap leading-[2]">
              {microText1}
            </div>
          )}
          {microText2 && (
            <div className="font-sans text-[10px] font-medium tracking-[0.12em] text-white/20 uppercase whitespace-pre-wrap leading-[2]">
              {microText2}
            </div>
          )}
        </div>
      )}

      {/* Code Stream Background */}
      {showCodeStream && (
        <div className="absolute top-[40%] left-[-20%] w-[200vw] pointer-events-none opacity-[0.04] text-[12px] font-mono tracking-[0.3em] whitespace-nowrap overflow-hidden mix-blend-screen z-[-1]">
          <div ref={codeStreamRef} className="inline-block text-[#F1EFEA]">
            01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10 01 10 01 11 00 10 SENSOR → PID → MOTOR 11 01 00 10
          </div>
        </div>
      )}

      <div className="relative z-10">
        {eyebrow && (
          <div className={`${styles.eyebrow} anim-item`} style={{ opacity: 0 }}>
            <span ref={dotRef}>●</span> {eyebrow}
          </div>
        )}

        {showSignalFlow && (
          <div className="anim-item flex items-center gap-4 text-[9px] tracking-[0.15em] font-mono text-white/30 mb-8 w-[250px] relative" style={{ opacity: 0 }}>
            <span>SENSOR</span>
            <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
              <div ref={signalDotRef} className="absolute left-0 top-[-1px] w-[3px] h-[3px] bg-[#F4C50D] shadow-[0_0_8px_#F4C50D]" />
            </div>
            <span>CONTROL</span>
            <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden"></div>
            <span>MOTOR</span>
          </div>
        )}
        
        <h2 
          className="anim-item"
          style={{ opacity: 0, color: '#F1EFEA', wordBreak: 'keep-all' }}
          dangerouslySetInnerHTML={{ __html: formattedTitle }} 
        />
        
        <p className="anim-item" style={{ opacity: 0, color: '#A9A9A6' }}>{body}</p>
        
        {tagline && (
          <div className={`${styles.tagline} anim-item`} style={{ opacity: 0 }}>
            {tagline}
          </div>
        )}
      </div>
    </div>
  );
}
