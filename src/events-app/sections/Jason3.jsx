import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Jason3 = () => {
  useGSAP(() => {
    gsap.set('.jason-sec-3', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.jason-sec-3',
        start: 'top 90%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.first-vd-3', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.jason-sec-3 .img-box', {
      scrollTrigger: {
        trigger: '.jason-sec-3',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -300, duration: 1, ease: 'power1.inOut'
    }, '<');
  });

  return (
    <section className="jason-sec-3">
      <div className="max-w-lg jason-content">
        <h1>LASER STRIKE</h1>
        <h2>A futuristic robotics combat challenge where teams use laser weapons.</h2>
        <p>Sensors enable robots to navigate, strategize, target opponents, and score points through extreme precision, demanding seamless teamwork.</p>

        <div className="jason-2">
          <img src="/img/ls1.png" alt="Jason 2" />
        </div>
      </div>

      <div className="space-y-5 mt-96 img-box">
        <div className="jason-1">
          <img src="/img/ls2.jpeg" alt="Jason 1" />
        </div>
        <div className="jason-3">
          <img src="/img/ls3.jpeg" alt="Jason 3" />
        </div>
      </div>
    </section>
  );
};

export default Jason3;
