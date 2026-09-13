import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./HeroTypography.module.css";

export default function HeroTypography() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup initial states
      gsap.set(".hero-anim", { 
        opacity: 0, 
        y: 60, 
        filter: "blur(8px)" 
      });
      gsap.set(".hero-dot", { scale: 0.5, opacity: 0 });

      // Build timeline
      const tl = gsap.timeline({ delay: 0.2 });

      // Animate the text lines
      tl.to(".hero-anim", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1
      });

      // Pulse the dot
      tl.to(".hero-dot", {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(2)",
      }, 0.2);

      tl.to(".hero-dot", {
        scale: 1.2,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }, "+=0.2");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.heroContainer}>
      
      {/* Background Gradient to ensure readability against busy backgrounds */}
      <div className={styles.readabilityGradient} />

      <div className={styles.heroContent}>
        
        {/* Eyebrow */}
        <div className={`${styles.eyebrow} hero-anim`}>
          <span className="hero-dot">●</span> ROBOTICS CLUB • MMMUT GORAKHPUR
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          <div className="hero-anim">BUILD</div>
          <div className="hero-anim">WHAT'S</div>
          <div className={`hero-anim ${styles.accentWord}`}>NEXT.</div>
        </h1>

        {/* Description */}
        <p className={`${styles.description} hero-anim`}>
          We design, build, and experiment with machines that move, think, and adapt.
        </p>

        {/* Tagline */}
        <div className={`${styles.tagline} hero-anim`}>
          <span className={styles.taglineLine}>—</span> WHERE IDEAS BECOME MACHINES.
        </div>

        {/* Subtle Micro-Text */}
        <div className={styles.microTextContainer}>
          <div className={styles.microText}>ROBOTICS CLUB<br/>EST. 2006</div>
        </div>
      </div>
    </div>
  );
}
