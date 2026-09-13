import Link from "next/link";
import { prefetchPlay } from "../../components/prefetch";
import Footer from "../../components/Footer";
import styles from "./Landing.module.css";
import { LinkPreview } from "../../components/ui/LinkPreview";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <defs>
      <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig)" />
    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm3.8-7.7a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" fill="#fff" />
    <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <rect width="24" height="24" rx="4" fill="#0077b5" />
    <path d="M7.5 19h-3v-9h3v9zM6 8.5c-.9 0-1.5-.6-1.5-1.5s.6-1.5 1.5-1.5 1.5.6 1.5 1.5-.6 1.5-1.5 1.5zm11 10.5h-3v-4.5c0-1.1-.4-1.8-1.4-1.8-1 0-1.5.7-1.5 1.4v4.9h-3s.1-8 0-9h3v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v5.1z" fill="#fff" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <circle cx="12" cy="12" r="12" fill="#1877f2" />
    <path d="M15 12h-2v8h-3v-8H8v-3h2V7c0-2.5 1.5-4 4-4h2v3h-1.5c-.9 0-1 .4-1 1v2h2.5L15 12z" fill="#fff" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    <rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="#fff" strokeWidth="1.5" />
    <path d="M2 6l10 7 10-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SOCIALS = [
  {
    name: "INSTAGRAM",
    handle: "@robotics_club_mmmut",
    url: "https://www.instagram.com/robotics_club_mmmut/?hl=en",
    icon: <InstagramIcon />,
  },
  {
    name: "LINKEDIN",
    handle: "Robotics Club MMMUT",
    url: "https://www.linkedin.com/company/robotics-club-mmmut-gorakhpur/posts/?feedView=all",
    icon: <LinkedInIcon />,
  },
  {
    name: "FACEBOOK",
    handle: "@roboticsclub.mmmut",
    url: "https://www.facebook.com/roboticsclub.mmmut/",
    icon: <FacebookIcon />,
  },
  {
    name: "EMAIL",
    handle: "roboticsclub.mmmut@gmail.com",
    url: "mailto:roboticsclub.mmmut@gmail.com",
    icon: <EmailIcon />,
  },
];

export default function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaInner}>
        <div className={styles.ctaLayout}>
          
          {/* Left Side: Text and Button */}
          <div className={styles.ctaTextContainer}>
            <h2>Built by us. Piloted by you.</h2>
            <p>Take control and put our flight demo to the test.</p>
            <Link
              href="/play"
              className={styles.ctaButton}
              onPointerEnter={prefetchPlay}
              onFocus={prefetchPlay}
            >
              Initiate Cyberpunk &rarr;
            </Link>
          </div>

          {/* Right Side: Social Cards */}
          <div className={styles.cardsGrid}>
            {SOCIALS.map((social) => {
              const isEmail = social.name === "EMAIL";
              const cardContent = (
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialCard}
                >
                  <div className={styles.iconWrapper}>{social.icon}</div>
                  <div className={styles.textWrapper}>
                    <span className={styles.cardTitle}>{social.name}</span>
                    <span className={styles.cardHandle}>{social.handle}</span>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                </a>
              );

              return isEmail ? (
                <div key={social.name}>{cardContent}</div>
              ) : (
                <LinkPreview key={social.name} url={social.url}>
                  {cardContent}
                </LinkPreview>
              );
            })}
          </div>

        </div>
      </div>
      <Footer />
    </section>
  );
}
