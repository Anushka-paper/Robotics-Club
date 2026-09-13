import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Jason = () => {
  useGSAP(() => {
    gsap.set('.jason', { marginTop: '-80vh' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.jason',
        start: 'top 90%',
        end: '10% center',
        scrub: 2,
      }
    }).to('.first-vd', { opacity: 0, duration: 1, ease: 'power1.inOut' });

    gsap.to('.jason .img-box', {
      scrollTrigger: {
        trigger: '.jason',
        start: 'top center',
        end: '80% center',
        scrub: 2
      }, y: -300, duration: 1, ease: 'power1.inOut'
    }, '<')
  })

  return (
    <section className="jason">
      <div className="max-w-lg jason-content">
        <h1>FAlCON'S GRID</h1>
        <h2>Build your own drone, master the controls, and race.</h2>
        <p>Navigate through challenging obstacles where unmatched speed, precision, and piloting skills ultimately determine who conquers the high-stakes grid and claims victory.</p>

        <div className="jason-2">
          <img src="/img/fl11.png" />
        </div>
      </div>

      <div className="space-y-5 mt-96 img-box">
        <div className="jason-1">
          <img src="/img/fl1.jpeg" />
        </div>
        <div className="jason-3">
          <img src="/img/fl3.jpeg" />
        </div>
      </div>
    </section>
  )
}

export default Jason