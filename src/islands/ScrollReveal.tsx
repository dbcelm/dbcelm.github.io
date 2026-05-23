import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('[data-reveal]');

    if (reduced) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    elements.forEach((el) => {
      const delay = parseFloat((el as HTMLElement).style.getPropertyValue('--delay') || '0');
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return null;
}
