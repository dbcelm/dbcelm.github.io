import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  name: string;
  role: string;
  tagline: string;
}

export default function AnimatedHero({ name, role, tagline }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !containerRef.current) return;

    const els = containerRef.current.querySelectorAll('[data-animate]');
    gsap.fromTo(
      els,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div ref={containerRef} className="animated-hero">
      <p className="animated-hero__label" data-animate>
        DevOps · Cloud · Platform Engineering
      </p>
      <h1 className="animated-hero__name" data-animate>
        {name}
      </h1>
      <p className="animated-hero__role" data-animate>
        {role}
      </p>
      <p className="animated-hero__tagline" data-animate>
        {tagline}
      </p>
      <style>{`
        .animated-hero__label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }
        .animated-hero__name {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 8vw, 5.5rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }
        .animated-hero__role {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 3vw, 2rem);
          font-weight: 500;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
        }
        .animated-hero__tagline {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--color-text-muted);
          max-width: 48ch;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
