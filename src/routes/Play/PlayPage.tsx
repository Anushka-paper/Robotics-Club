"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { useDocumentMeta } from "../../components/useDocumentMeta";
import ReducedMotionNotice from "../../components/ReducedMotionNotice";
import GameCanvas from "./GameCanvas";
import Hud from "./Hud";
import StartScreen from "./StartScreen";
import useStore from "./store";
import styles from "./Play.module.css";

export default function PlayPage() {
  useDocumentMeta(
    "The Experience — Robotics Club flight demo",
    "Fly a ship along a glowing track, steer with your mouse and fire at rocks and drones. A Robotics Club demo.",
  );

  const reducedMotion = usePrefersReducedMotion();
  const [motionOverride, setMotionOverride] = useState(false);
  const showGame = !reducedMotion || motionOverride;

  const running = useStore((s) => s.running);
  const actions = useStore((s) => s.actions);

  const small = useMemo(
    () => typeof window !== "undefined" && window.innerWidth <= 700,
    [],
  );
  const coarse = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    [],
  );
  const [touchDismissed, setTouchDismissed] = useState(false);

  const bodyStyle = useRef<{ background: string; cursor: string; overflow: string }>(
    null!,
  );

  // Reset run state + lock the page BEFORE the Canvas mounts and calls init().
  useLayoutEffect(() => {
    if (!showGame) return;
    actions.reset();

    bodyStyle.current = {
      background: document.body.style.background,
      cursor: document.body.style.cursor,
      overflow: document.body.style.overflow,
    };
    document.body.style.background = "#020209";
    document.body.style.cursor = "crosshair";
    document.body.style.overflow = "hidden";

    return () => {
      actions.dispose();
      document.body.style.background = bodyStyle.current.background;
      document.body.style.cursor = bodyStyle.current.cursor;
      document.body.style.overflow = bodyStyle.current.overflow;
    };
  }, [showGame, actions]);

  // Pause the loop while the tab is hidden.
  useEffect(() => {
    if (!showGame) return;
    const onVis = () => actions.setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [showGame, actions]);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => actions.updateMouse(e),
    [actions],
  );
  const onClick = useCallback(() => actions.shoot(), [actions]);
  const onTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      const t = e.touches[0];
      if (t) actions.updateMouse({ clientX: t.clientX, clientY: t.clientY });
    },
    [actions],
  );
  const onTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      const t = e.touches[0];
      if (t) actions.updateMouse({ clientX: t.clientX, clientY: t.clientY });
      actions.shoot();
    },
    [actions],
  );

  if (!showGame) {
    return <ReducedMotionNotice onPlayAnyway={() => setMotionOverride(true)} />;
  }

  return (
    <div
      className={styles.page}
      onPointerMove={onPointerMove}
      onClick={onClick}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
    >
      <GameCanvas small={small} />
      <Hud />
      {!running && <StartScreen onStart={() => actions.start()} />}

      {coarse && !touchDismissed && running && (
        <div className={styles.touchNote}>
          <span>Best played with a mouse.</span>
          <button type="button" onClick={() => setTouchDismissed(true)}>
            Dismiss
          </button>
          <Link href="/">&larr; Home</Link>
        </div>
      )}
    </div>
  );
}
