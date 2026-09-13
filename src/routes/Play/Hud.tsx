// Ported from pmndrs/examples "space-game" (src/Hud.tsx).
// Changes: styled-components -> CSS module (no global styles leak); the
// author's sandbox/twitter/github links replaced with a home link, the sound
// toggle and a pmndrs credit; brand fonts/colors.
import { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import useStore from "./store";
import styles from "./Hud.module.css";

export default function Hud() {
  const points = useStore((state) => state.points);
  const health = useStore((state) => state.health);
  const running = useStore((state) => state.running);
  const paused = useStore((state) => state.paused);
  const startTime = useStore((state) => state.mutation.startTime);

  const seconds = useRef<HTMLParagraphElement>(null!);
  useEffect(() => {
    const i = setInterval(() => {
      if (!seconds.current) return;
      if (!running || paused) return;
      seconds.current.innerText = ((Date.now() - startTime) / 1000).toFixed(1);
    }, 100);
    return () => clearInterval(i);
  }, [running, paused, startTime]);

  const score = useMemo(
    () => (points >= 1000 ? (points / 1000).toFixed(1) + "K" : String(points)),
    [points],
  );

  return (
    <>
      <nav className={styles.upperLeft}>
        <Link href="/">&larr; home</Link>
      </nav>

      <div className={styles.lowerLeft}>
        <p ref={seconds} className={styles.timer}>
          0.0
        </p>
        <p className={styles.score}>{score}</p>
      </div>

      <div className={styles.lowerRight} aria-hidden="true">
        <div style={{ width: health + "%" }} />
      </div>
    </>
  );
}
