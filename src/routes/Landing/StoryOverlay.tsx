import {
  useCallback,
  useRef,
  type RefObject,
  type UIEvent,
} from "react";
import CallToAction from "./CallToAction";
import PageCards from "../../components/PageCards";
import EmbedxCard from "../../components/EmbedxCard";
import HeroTypography from "./HeroTypography";
import SectionCard from "./SectionCard";
import styles from "./Landing.module.css";

// TODO(copy): all seven titles + bodies below are draft copy — replace.
// Order is fixed: it must match the baked camera stops in model.glb.
type StoryStop = {
  object: string;
  title: string;
  body: string;
  eyebrow?: string;
  tagline?: string;
  align?: "left" | "right";
  microText1?: string;
  microText2?: string;
  showSignalFlow?: boolean;
  showCodeStream?: boolean;
};

const STOPS: StoryStop[] = [
  {
    object: "VR headset",
    eyebrow: "ROBOTICS CLUB • MMMUT GORAKHPUR",
    title: "See it before you\nbuild it.",
    body: "We design, build and experiment with machines that move, think and adapt.",
    tagline: "WHERE IDEAS BECOME MACHINES.",
  },
  {
    object: "headphones",
    eyebrow: "INSIDE THE LAB",
    title: "WHERE\u00A0MACHINES\nCOME\u00A0TO\nLIFE.",
    body: "From circuits and code to motors and mechanisms, we turn ambitious ideas into working machines.",
    align: "right",
  },
  {
    object: "rocket",
    eyebrow: "01 / FIRST BUILD",
    title: "BUILD YOUR FIRST\nROBOT.",
    body: "Start with the basics, get your hands dirty, and turn your first idea into a machine that actually moves.",
    microText1: "RC-01\nPROTOTYPE",
  },
  {
    object: "turbine",
    eyebrow: "02 / CONTROL SYSTEMS",
    title: "FROM SIGNAL\nTO MOTION.",
    body: "Every movement starts with information. We connect sensors, code, and motors to turn signals into action.",
    microText1: "SENSOR\n↓\nPROCESS\n↓\nMOTION",
    showSignalFlow: true,
    align: "right",
  },
  {
    object: "table",
    eyebrow: "03 / THE LAB",
    title: "YOUR\u00A0SPACE.\nYOUR\u00A0TOOLS.\nYOUR\u00A0BUILD.",
    body: "Tools, components, workspace, and a team that makes building a lot easier.",
  },
  {
    object: "laptop",
    eyebrow: "04 / SOFTWARE & CONTROL",
    title: "CODE\u00A0THE\nBEHAVIOR.",
    body: "Firmware, control loops, and computer vision—the code that turns hardware into intelligent machines.",
    microText1: "INPUT\n↓\nPROCESS\n↓\nOUTPUT",
    showCodeStream: true,
    align: "right",
  },
  {
    object: "zeppelin",
    eyebrow: "05 / KEEP BUILDING",
    title: "THE\u00A0BUILD\nDOESN'T\u00A0END.",
    body: "From your first prototype to competition-ready machines, keep building with people who want to go further.",
    microText1: "BUILD → COMPETE → RESEARCH → REPEAT",
  },
];

const HEIGHTS = ["400vh", "200vh", "200vh", "200vh", "200vh", "200vh", "200vh"];

type Props = {
  scroll: RefObject<number>;
  /** true = prefers-reduced-motion: plain scrolling content, no camera drive */
  isStatic?: boolean;
};

export default function StoryOverlay({ scroll, isStatic = false }: Props) {
  const storyRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const onScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      if (isStatic) return;
      const el = e.currentTarget;
      const story = storyRef.current;
      if (!story) return;
      // §4.3: progress is measured over the seven story sections only, so the
      // trailing call-to-action section cannot desync the camera.
      const denom = story.offsetHeight - window.innerHeight;
      const p = denom > 0 ? el.scrollTop / denom : 0;
      const clamped = Math.min(1, Math.max(0, p));
      scroll.current = clamped;
      if (fillRef.current)
        fillRef.current.style.transform = `scaleY(${clamped})`;
    },
    [isStatic, scroll],
  );

  return (
    <div
      className={isStatic ? styles.scrollStatic : styles.scroll}
      onScroll={onScroll}
    >
      {!isStatic && (
        <div className={styles.progress} aria-hidden="true">
          <span ref={fillRef} />
        </div>
      )}

      <div ref={storyRef}>
        <div className="absolute top-[90px] md:top-[80px] left-0 w-full flex justify-center z-50 pointer-events-none px-4 md:px-6">
          <EmbedxCard />
        </div>
        {STOPS.map((stop, i) => (
          <section
            key={stop.object}
            className={`${styles.section} relative`}
            style={isStatic ? undefined : { height: HEIGHTS[i] }}
          >
            {i > 0 && (
              <div 
                className="absolute top-0 left-0 w-full h-[1px] flex items-center justify-center pointer-events-none z-30 opacity-0 transition-all duration-700 ease-out translate-y-4"
                style={{ 
                  background: 'linear-gradient(90deg, transparent 0%, rgba(241,239,234,0.08) 25%, rgba(241,239,234,0.18) 50%, rgba(241,239,234,0.08) 75%, transparent 100%)',
                }}
                ref={(el) => {
                  if (el && !isStatic) {
                    const observer = new IntersectionObserver(([entry]) => {
                      if (entry.isIntersecting) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0) scaleX(1)';
                        observer.disconnect();
                      }
                    }, { threshold: 0.1 });
                    observer.observe(el);
                    el.style.transform = 'translateY(0) scaleX(0.8)'; // Initial state
                  }
                }}
              >
                <div className="w-[30px] md:w-[60px] h-[1px] bg-[#F4C50D] shadow-[0_0_12px_rgba(244,197,13,0.12)]"></div>
              </div>
            )}
            {i === 0 ? (
              <HeroTypography />
            ) : (
              <SectionCard 
                eyebrow={stop.eyebrow}
                title={stop.title}
                body={stop.body}
                tagline={stop.tagline}
                microText1={stop.microText1}
                microText2={stop.microText2}
                showSignalFlow={stop.showSignalFlow}
                showCodeStream={stop.showCodeStream}
                align={stop.align}
              />
            )}
          </section>
        ))}
      </div>

      <div className="relative z-10 w-full overflow-hidden bg-[#0e0f12] border-t border-[#2a2d34]">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:bg-[center_20%] opacity-100 pointer-events-none"
          style={{ backgroundImage: "url('/facility-bg.png')" }}
        />
        
        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0f12] via-[#0e0f12]/10 to-[#0e0f12] pointer-events-none" />
        
        {/* Cinematic fine grain / noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10">
          <PageCards />
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
