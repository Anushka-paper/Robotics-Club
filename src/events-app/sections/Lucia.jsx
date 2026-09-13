import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Lucia = () => {
  useGSAP(() => {
    gsap.set('.lucia-life', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.lucia-life',
        start: 'top 80%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.second-vd', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.lucia-life .img-box', {
      scrollTrigger: {
        trigger: '.lucia-life',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -200, duration: 1, ease: 'power1.inOut'
    }, '<')
  });

  return (
    <section className="lucia-life">
      <div className="flex flex-col gap-5 items-end img-box lg:1/2 ps-10 mt-96">
        <div className="lucia-1">
          <img src="/img/rw1.jpeg" />
        </div>
        <div className="lucia-3">
          <img src="/img/rw3.png" />
        </div>
      </div>

      <div className="lg:w-1/2 lucia-life-content">
        <div className="max-w-xl lg:ps-32 ps-10">
          <h1>ROBO-WARS</h1>
          <h2>A thrilling robot battle testing strength, strategy, control, and engineering skills.</h2>
          <p>Enter the ultimate robotic showdown where powerful bots clash in
            an intense arena, testing engineering, strategy, control, durability,
            and combat skills to claim victory</p>
        </div>

        <div className="lucia-2">
          <img src="/img/rw2.jpeg" />
        </div>

        <p className="max-w-xl lg:ps-32 ps-10"> </p>
      </div>
    </section>
  )
}

export default Lucia