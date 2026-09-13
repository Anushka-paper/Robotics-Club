import Link from "next/link";
import logo from "../assets/club-logo.png";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Robotics Club home">
        <img src={logo.src} alt="Robotics Club Logo" className={styles.logo} width={44} height={44} />
        <span>Robotics Club</span>
      </Link>
      <nav className={styles.navLinks}>
        <Link href="/events">Events</Link>
        <Link href="/team">Team</Link>
        <Link href="/embedx" className={styles.cta}>
          EMBEDX <span className={styles.arrow}>&rarr;</span>
        </Link>
        <Link href="/play" className={styles.cta}>
          CYBERPUNK <span className={styles.arrow}>&rarr;</span>
        </Link>
      </nav>
    </header>
  );
}
