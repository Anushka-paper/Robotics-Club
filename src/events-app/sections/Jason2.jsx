import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Jason2 = () => {
  useGSAP(() => {
    gsap.set('.jason-sec-2', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.jason-sec-2',
        start: 'top 90%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.first-vd-2', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.jason-sec-2 .img-box', {
      scrollTrigger: {
        trigger: '.jason-sec-2',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -300, duration: 1, ease: 'power1.inOut'
    }, '<');
  });

  return (
    <section className="jason-sec-2">
      <div className="max-w-lg jason-content">
        <h1>BOMB DIFFUSION</h1>
        <h2>Race against time, crack cryptic puzzles, decode hidden clues, master wiring.</h2>
        <p>Outsmart escalating obstacles by uniting your team, staying calm, thinking fast, and diffusing the bomb before time runs out.</p>

        <div className="jason-2">
          <img src="/img/bd1.jpeg" />
        </div>
      </div>

      <div className="space-y-5 mt-96 img-box">
        <div className="jason-1">
          <img src="/img/bd2.jpeg" alt="Jason 1" />
        </div>
        <div className="jason-3">
          <img src="/img/bd3.png" alt="Jason 3" />
        </div>
      </div>
    </section>
  );
};

export default Jason2;
