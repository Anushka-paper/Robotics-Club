import Link from "next/link";
import styles from "./Play.module.css";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h1>The Experience</h1>
        <p>Move your mouse to steer. Click to fire.</p>
        <div className={styles.row}>
          <button type="button" className={styles.start} onClick={onStart}>
            Start run
          </button>
          <Link href="/" className={styles.back}>
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
