import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from "react";

const FirstVideo2 = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.set('.first-vd-wrapper-2', { marginTop: '-60vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.first-vd-wrapper-2',
        start: 'top top',
        end: '+=200% top',
        scrub: 1,
        pin: true,
      }
    });

    tl.to('.first-vd-wrapper-2', { opacity: 1, duration: 1.5, ease: 'none' });

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
    <section className="first-vd-wrapper-2">
      <div className="h-dvh">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/vids/bomdif_intra.mp4"
          className="first-vd-2"
        />
      </div>
    </section>
  );
};

export default FirstVideo2;
