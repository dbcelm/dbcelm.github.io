import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup {
  id: string;
  category: string;
  shortLabel: string;
  description: string;
  accent: string;
  span: number;
  items: string[];
}

interface Props {
  skills: SkillGroup[];
}

const icons: Record<string, React.ReactNode> = {
  platform: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3L3 8.5v7L12 21l9-5.5v-7L12 3z" />
      <path d="M12 12l9-3.5M12 12v9M12 12L3 8.5" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M7 18h10a4 4 0 000-8 5.5 5.5 0 00-10.6-1.4A3.5 3.5 0 007 18z" />
    </svg>
  ),
  delivery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.2 7.4l3.6 8.2M15.8 7.4l-3.6 8.2" />
    </svg>
  ),
  observability: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 18V6" />
      <path d="M4 18h16" />
      <path d="M8 14l3-4 3 2.5 4-6" />
    </svg>
  ),
  systems: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 20h10M9 18v2M15 18v2" />
      <path d="M7 9h2M7 12h6" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};

export default function SkillMatrix({ skills }: Props) {
  const [activeFilter, setActiveFilter] = useState('all');
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') return skills;
    return skills.filter((group) => group.id === activeFilter);
  }, [activeFilter, skills]);

  const allTools = useMemo(
    () => [...new Set(skills.flatMap((group) => group.items))],
    [skills],
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.skill-card');

    if (reduced) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    gsap.fromTo(
      cards,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 82%',
          once: true,
        },
      },
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.skill-card');
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
    );
  }, [activeFilter]);

  const handleCardMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--spot-x', `${x}%`);
    card.style.setProperty('--spot-y', `${y}%`);
  };

  return (
    <div ref={rootRef} className="skill-matrix">
      <nav className="skill-matrix__filters" aria-label="Filter skill domains">
        <button
          type="button"
          className={`skill-filter${activeFilter === 'all' ? ' is-active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All domains
        </button>
        {skills.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`skill-filter${activeFilter === group.id ? ' is-active' : ''}`}
            onClick={() => setActiveFilter(group.id)}
            style={{ '--filter-accent': group.accent } as React.CSSProperties}
          >
            {group.shortLabel}
          </button>
        ))}
      </nav>

      <div ref={gridRef} className="skill-bento">
        {filteredSkills.map((group) => {
          const groupIndex = skills.findIndex((entry) => entry.id === group.id);

          return (
          <article
            key={group.id}
            className={`skill-card${
              group.span >= 3 ? ' skill-card--full' : group.span > 1 ? ' skill-card--wide' : ''
            }`}
            style={
              {
                '--card-accent': group.accent,
                '--card-index': groupIndex,
              } as React.CSSProperties
            }
            onMouseMove={handleCardMove}
          >
            <header className="skill-card__header">
              <span className="skill-card__icon">{icons[group.id]}</span>
              <div>
                <span className="skill-card__index">0{groupIndex + 1}</span>
                <h3 className="skill-card__title">{group.category}</h3>
              </div>
            </header>
            <p className="skill-card__desc">{group.description}</p>
            <div className="skill-card__items">
              {group.items.map((item) => (
                <span key={item} className="skill-chip">
                  {item}
                </span>
              ))}
            </div>
          </article>
          );
        })}
      </div>

      <div className="skill-ticker" aria-hidden="true">
        <div className="skill-ticker__track">
          {[...allTools, ...allTools].map((tool, i) => (
            <span key={`${tool}-${i}`} className="skill-ticker__item">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .skill-matrix {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .skill-matrix__filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }

        .skill-filter {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.02);
          color: var(--color-text-muted);
          cursor: pointer;
          transition: border-color 0.25s, color 0.25s, background 0.25s, box-shadow 0.25s;
        }

        .skill-filter:hover {
          border-color: var(--color-border-accent);
          color: var(--color-text);
        }

        .skill-filter.is-active {
          color: var(--color-text);
          border-color: color-mix(in srgb, var(--filter-accent, var(--color-accent)) 55%, transparent);
          background: color-mix(in srgb, var(--filter-accent, var(--color-accent)) 12%, transparent);
          box-shadow: 0 0 24px color-mix(in srgb, var(--filter-accent, var(--color-accent)) 18%, transparent);
        }

        .skill-filter:first-child.is-active {
          border-color: var(--color-border-accent);
          background: rgba(59, 130, 246, 0.12);
          box-shadow: 0 0 24px var(--color-accent-glow);
        }

        .skill-bento {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .skill-bento {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .skill-card--full {
            grid-column: 1 / -1;
          }
        }

        @media (min-width: 1024px) {
          .skill-bento {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .skill-card--wide {
            grid-column: span 2;
          }

          .skill-card--full {
            grid-column: 1 / -1;
          }
        }

        .skill-card {
          position: relative;
          overflow: hidden;
          padding: 1.65rem;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background:
            radial-gradient(
              520px circle at var(--spot-x, 50%) var(--spot-y, 0%),
              color-mix(in srgb, var(--card-accent) 16%, transparent),
              transparent 42%
            ),
            linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
          transition: border-color 0.3s, transform 0.3s;
        }

        .skill-card::before {
          content: '';
          position: absolute;
          top: -35%;
          right: -15%;
          width: 50%;
          height: 75%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--card-accent) 14%, transparent) 0%,
            transparent 68%
          );
          pointer-events: none;
          opacity: 0.55;
          transition: opacity 0.35s;
        }

        .skill-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--card-accent) 22%, transparent),
            transparent 38%,
            transparent 72%,
            color-mix(in srgb, var(--card-accent) 8%, transparent)
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          pointer-events: none;
          opacity: 0.45;
        }

        .skill-card:hover::before {
          opacity: 0.85;
        }

        .skill-card:hover::after {
          opacity: 0.7;
        }

        .skill-card:hover {
          border-color: color-mix(in srgb, var(--card-accent) 45%, var(--color-border));
          transform: translateY(-3px);
        }

        .skill-card__header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .skill-card__icon {
          display: grid;
          place-items: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 10px;
          color: var(--card-accent);
          background: color-mix(in srgb, var(--card-accent) 14%, transparent);
          border: 1px solid color-mix(in srgb, var(--card-accent) 28%, transparent);
          flex-shrink: 0;
        }

        .skill-card__icon svg {
          width: 1.35rem;
          height: 1.35rem;
        }

        .skill-card__index {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: var(--card-accent);
          margin-bottom: 0.35rem;
        }

        .skill-card__title {
          font-family: var(--font-display);
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          font-weight: 600;
          line-height: 1.25;
          color: var(--color-text);
        }

        .skill-card__desc {
          position: relative;
          z-index: 1;
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-text-muted);
          margin-bottom: 1.25rem;
          max-width: 52ch;
        }

        .skill-card--full .skill-card__desc {
          max-width: 72ch;
        }

        .skill-card__header,
        .skill-card__items {
          position: relative;
          z-index: 1;
        }

        .skill-card__items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-chip {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.02em;
          padding: 0.38rem 0.72rem;
          border-radius: 6px;
          color: var(--color-text);
          border: 1px solid color-mix(in srgb, var(--card-accent) 22%, var(--color-border));
          background: color-mix(in srgb, var(--card-accent) 8%, rgba(255, 255, 255, 0.02));
          transition: border-color 0.25s, background 0.25s;
        }

        .skill-card:hover .skill-chip {
          border-color: color-mix(in srgb, var(--card-accent) 38%, var(--color-border));
          background: color-mix(in srgb, var(--card-accent) 14%, rgba(255, 255, 255, 0.02));
        }

        .skill-ticker {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
          border-block: 1px solid var(--color-border);
          padding-block: 0.85rem;
        }

        .skill-ticker__track {
          display: flex;
          width: max-content;
          gap: 2rem;
          animation: skill-ticker-scroll 42s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .skill-ticker__track {
            animation: none;
            flex-wrap: wrap;
            width: auto;
            justify-content: center;
          }
        }

        .skill-ticker__item {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-mono);
          white-space: nowrap;
        }

        .skill-ticker__item::before {
          content: '◆';
          margin-right: 0.65rem;
          color: var(--color-accent);
          font-size: 0.5rem;
          vertical-align: middle;
        }

        @keyframes skill-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
