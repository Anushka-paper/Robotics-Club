import { animate, stagger } from 'animejs';
import { useAnimeOnScroll } from '@/hooks/useAnimeOnScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function SponsorsMarquee() {
  const reducedMotion = useReducedMotion();
  const ref = useAnimeOnScroll(() => {
    if (!reducedMotion) {
      animate('.sponsor-logo', {
        opacity: [0, 0.4],
        translateY: [20, 0],
        duration: 800,
        delay: stagger(100),
        easing: 'easeOutExpo'
      });
    } else {
      document.querySelectorAll('.sponsor-logo').forEach((el: any) => { 
        el.style.opacity = '0.4'; 
        el.style.transform = 'none'; 
      });
    }
  });

  return (
    <section className="py-16 bg-black overflow-hidden relative z-10">
      <div ref={ref} className="container mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-24">
        {['CyberDyne', 'Tyrell Corp', 'Weyland-Yutani', 'Massive Dynamic'].map(sponsor => (
          <div key={sponsor} className="sponsor-logo text-xl md:text-2xl font-black tracking-widest uppercase text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            {sponsor}
          </div>
        ))}
      </div>
    </section>
  );
}
