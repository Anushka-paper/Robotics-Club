import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from "react"

const FirstVideo = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.set('.first-vd-wrapper', { marginTop: '-150vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.first-vd-wrapper',
        start: 'top top',
        end: '+=200% top',
        scrub: 1,
        pin: true,
      }
    })

    tl.to('.hero-section', { delay: 0.5, opacity: 0, ease: 'none' });
    tl.to('.first-vd-wrapper', { opacity: 1, duration: 2, ease: 'none' });

    const initVideoScrub = () => {
      if (videoRef.current && videoRef.current.duration) {
        tl.to(videoRef.current, { currentTime: videoRef.current.duration, duration: 3, ease: 'none' }, '<');
        ScrollTrigger.refresh();
      }
    };

    if (videoRef.current) {
      if (videoRef.current.readyState >= 1) {
        initVideoScrub();
      } else {
        videoRef.current.onloadedmetadata = initVideoScrub;
      }
    }
  }, []);

  return (
    <section className="first-vd-wrapper">
      <div className="h-dvh">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/vids/falconvid_intra.mp4"
          className="first-vd"
        />
      </div>
    </section>
  )
}

export default FirstVideo