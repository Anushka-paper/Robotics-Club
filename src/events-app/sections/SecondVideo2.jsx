import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

const SecondVideo2 = () => {
  const videoRef = useRef(null);

  useGSAP(() => {
    gsap.set('.second-vd-wrapper-2', { marginTop: '-60vh', opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.second-vd-wrapper-2',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        pin: true,
      }
    });

    tl.to('.second-vd-wrapper-2', { opacity: 1, duration: 1, ease: 'none' });

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
    <section className="second-vd-wrapper-2">
      <div className="h-dvh">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/vids/shervid_intra.mp4"
          className="size-full object-cover second-vd-2"
          style={{
            objectPosition: '15% 0%'
          }}
        />
      </div>
    </section>
  );
};

export default SecondVideo2;
