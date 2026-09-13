import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Jason4 = () => {
  useGSAP(() => {
    gsap.set('.jason-sec-4', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.jason-sec-4',
        start: 'top 90%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.first-vd-4', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.jason-sec-4 .img-box', {
      scrollTrigger: {
        trigger: '.jason-sec-4',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -300, duration: 1, ease: 'power1.inOut'
    }, '<');
  });

  return (
    <section className="jason-sec-4">
      <div className="max-w-lg jason-content">
        <h1>ELECTRO TEKKEN</h1>
        <h2>Electro Tekken transforms real-world movements into high-precision gameplay.</h2>
        <p>Using motion tracking and adaptive machine learning, your physical punches, kicks, and combos control the action for an immersive combat experience.</p>

        <div className="jason-2">
          <img src="/img/tk3.png" alt="Jason 4" />
        </div>
      </div>

      <div className="space-y-5 mt-96 img-box">
        <div className="jason-1">
          <img src="/img/tk1.jpeg" alt="Jason 1" />
        </div>
        <div className="jason-3">
          <img src="/img/tk2.jpeg" alt="Jason 3" />
        </div>
      </div>
    </section>
  );
};

export default Jason4;
