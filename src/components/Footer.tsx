import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>Robotics Club</span>
      <span className={styles.links}>
        <a href="mailto:roboticsclub.mmmut@gmail.com">roboticsclub.mmmut@gmail.com</a>
      </span>
    </footer>
  );
}
