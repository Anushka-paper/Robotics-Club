"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './SideNav.module.css';

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Navigation Strip */}
      <nav className={`${styles.navStrip} ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
        <ul className={styles.navList}>
          <li style={{ '--i': 1 } as React.CSSProperties}>
            <Link href="/events" className={styles.navItem} onClick={() => setIsOpen(false)}>
              EVENTS
            </Link>
          </li>
          <li style={{ '--i': 2 } as React.CSSProperties}>
            <Link href="/team" className={styles.navItem} onClick={() => setIsOpen(false)}>
              TEAM
            </Link>
          </li>
          <li style={{ '--i': 3 } as React.CSSProperties}>
            <a href="#gallery" className={styles.navItem} onClick={() => setIsOpen(false)}>
              GALLERY
            </a>
          </li>
        </ul>
      </nav>

      {/* Hamburger Toggle */}
      <button 
        className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </button>
    </div>
  );
}
