import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Lucia2 = () => {
  useGSAP(() => {
    gsap.set('.lucia-life-sec-2', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.lucia-life-sec-2',
        start: 'top 80%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.second-vd-2', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.lucia-life-sec-2 .img-box', {
      scrollTrigger: {
        trigger: '.lucia-life-sec-2',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -200, duration: 1, ease: 'power1.inOut'
    }, '<');
  });

  return (
    <section className="lucia-life-sec-2">
      <div className="flex flex-col gap-5 items-end img-box lg:1/2 ps-10 mt-96">
        <div className="lucia-1">
          <img src="/img/sh2.jpeg" alt="Lucia 1" />
        </div>
        <div className="lucia-3">
          <img src="/img/sh3.png" alt="Lucia 3" />
        </div>
      </div>

      <div className="lg:w-1/2 lucia-life-content">
        <div className="max-w-xl lg:ps-32 ps-10">
          <h1>SHERLOCKED</h1>
          <h2>CRACK THE CASE.
            BEAT THE CLOCK.</h2>
          <p>Step into a race against time where cryptic clues, mind-bending
            puzzles, hidden codes, and teamwork collide. Decode the mystery,
            outsmart rivals, and become the ultimate detective</p>
        </div>

        <div className="lucia-2">
          <img src="/img/sh1.jpeg" alt="Lucia 2" />
        </div>

        <p className="max-w-xl lg:ps-32 ps-10"> </p>
      </div>
    </section>
  );
};

export default Lucia2;