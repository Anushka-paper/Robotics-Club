import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Lucia3 = () => {
  useGSAP(() => {
    gsap.set('.lucia-life-sec-3', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.lucia-life-sec-3',
        start: 'top 80%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.second-vd-3', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.lucia-life-sec-3 .img-box', {
      scrollTrigger: {
        trigger: '.lucia-life-sec-3',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -200, duration: 1, ease: 'power1.inOut'
    }, '<');
  });

  return (
    <section className="lucia-life-sec-3">
      <div className="flex flex-col gap-5 items-end img-box lg:1/2 ps-10 mt-96">
        <div className="lucia-1">
          <img src="/img/nf2.jpeg" alt="Lucia 1" />
        </div>
        <div className="lucia-3">
          <img src="/img/nf1.png" alt="Lucia 3" />
        </div>
      </div>

      <div className="lg:w-1/2 lucia-life-content">
        <div className="max-w-xl lg:ps-32 ps-10">
          <h1>ELECTRO NFS</h1>
          <h2>A high-speed robotics racing challenge where players use a physical.</h2>
          <p>A steering ring drives a live digital race as every turn, brake, and throttle input is read in real time and flawlessly mirrored on the track..</p>
        </div>

        <div className="lucia-2">
          <img src="/img/nf3.jpeg" alt="Lucia 2" />
        </div>

        <p className="max-w-xl lg:ps-32 ps-10"> </p>
      </div>
    </section>
  );
};

export default Lucia3;
