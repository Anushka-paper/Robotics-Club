import Link from "next/link";
import styles from "./ReducedMotionNotice.module.css";

export default function ReducedMotionNotice({
  onPlayAnyway,
}: {
  onPlayAnyway: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1>The Experience</h1>
        <p>
          This is a fast-moving flight game with constant camera motion. Your
          system is set to reduce motion, so it is paused.
        </p>
        <div className={styles.row}>
          <button type="button" className={styles.play} onClick={onPlayAnyway}>
            Play anyway
          </button>
          <Link href="/" className={styles.back}>
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
