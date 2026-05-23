import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const formatValue = (n: number) => n.toLocaleString('en-US');

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const formatStat = (value: number, prefix = '', suffix: string) =>
  `${prefix}${formatValue(value)}${suffix}`;

interface Props {
  stats: Stat[];
}

export default function StatCounter({ stats }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('[data-stat-value]');

    if (reduced) {
      items.forEach((el) => {
        const target = Number(el.getAttribute('data-stat-value'));
        const prefix = el.getAttribute('data-stat-prefix') ?? '';
        const suffix = el.getAttribute('data-stat-suffix') ?? '';
        el.textContent = formatStat(target, prefix, suffix);
      });
      return;
    }

    items.forEach((el) => {
      const target = Number(el.getAttribute('data-stat-value'));
      const prefix = el.getAttribute('data-stat-prefix') ?? '';
      const suffix = el.getAttribute('data-stat-suffix') ?? '';
      const counter = { val: 0 };

      gsap.to(counter, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = formatStat(Math.round(counter.val), prefix, suffix);
        },
      });
    });

    gsap.from(containerRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [stats]);

  return (
    <div ref={containerRef} className="stat-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span
            className="stat-item__value"
            data-stat-value={stat.value}
            data-stat-prefix={stat.prefix ?? ''}
            data-stat-suffix={stat.suffix}
          >
            {formatStat(0, stat.prefix, stat.suffix)}
          </span>
          <span className="stat-item__label">{stat.label}</span>
        </div>
      ))}
      <style>{`
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .stat-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .stat-item {
          text-align: center;
        }
        .stat-item__value {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 700;
          color: var(--color-highlight);
          line-height: 1;
          margin-bottom: 0.5rem;
          font-variant-numeric: tabular-nums;
        }
        .stat-item__label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted);
          line-height: 1.45;
          max-width: 16ch;
          margin-inline: auto;
        }
      `}</style>
    </div>
  );
}
