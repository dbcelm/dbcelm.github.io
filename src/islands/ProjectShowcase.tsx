import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectSection {
  type: 'text' | 'diagram' | 'illustration';
  title?: string;
  body?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

interface ProjectDetail {
  overview?: string;
  highlights?: string[];
  sections?: ProjectSection[];
}

interface Project {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  accent?: string;
  detail?: ProjectDetail;
}

interface Props {
  projects: Project[];
}

export default function ProjectShowcase({ projects }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find((project) => project.id === activeId) ?? null;

  const closeModal = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!sectionRef.current || !railRef.current) return;

    const tiles = railRef.current.querySelectorAll('.project-tile');

    if (reduced) return;

    gsap.from(tiles, {
      x: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 82%',
        once: true,
      },
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [projects]);

  useEffect(() => {
    if (!activeProject) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeProject, closeModal]);

  const scrollRail = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const amount = direction === 'left' ? -340 : 340;
    railRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div ref={sectionRef} className="project-showcase">
      <div className="project-showcase__controls">
        <button type="button" className="project-showcase__nav" onClick={() => scrollRail('left')} aria-label="Scroll projects left">
          ←
        </button>
        <button type="button" className="project-showcase__nav" onClick={() => scrollRail('right')} aria-label="Scroll projects right">
          →
        </button>
      </div>

      <div ref={railRef} className="project-rail" role="list">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className="project-tile"
            style={{ '--tile-accent': project.accent ?? '#3b82f6' } as React.CSSProperties}
            onClick={() => setActiveId(project.id)}
            role="listitem"
            aria-haspopup="dialog"
          >
            <span className="project-tile__index">0{index + 1}</span>
            <h3 className="project-tile__title">{project.title}</h3>
            <p className="project-tile__summary">{project.summary}</p>
            <div className="project-tile__tags">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="project-tile__tag">
                  {tag}
                </span>
              ))}
            </div>
            <span className="project-tile__cta">Read More</span>
          </button>
        ))}
      </div>

      <p className="project-showcase__hint">
        <span className="project-showcase__hint-icon" aria-hidden="true">↔</span>
        Scroll horizontally to browse projects, then click a tile to open the case study.
      </p>

      {activeProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby={`project-${activeProject.id}-title`}>
          <button type="button" className="project-modal__backdrop" onClick={closeModal} aria-label="Close project details" />
          <div className="project-modal__panel">
            <header className="project-modal__header">
              <div>
                <span className="project-modal__label">Case study</span>
                <h2 id={`project-${activeProject.id}-title`} className="project-modal__title">
                  {activeProject.title}
                </h2>
              </div>
              <button type="button" className="project-modal__close" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </header>

            <div className="project-modal__body">
              <p className="project-modal__overview">
                {activeProject.detail?.overview ?? activeProject.summary}
              </p>

              {activeProject.detail?.highlights && activeProject.detail.highlights.length > 0 && (
                <ul className="project-modal__highlights">
                  {activeProject.detail.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {activeProject.detail?.sections?.map((section, index) => (
                <section key={`${section.type}-${index}`} className={`project-modal__section project-modal__section--${section.type}`}>
                  {section.title && <h3 className="project-modal__section-title">{section.title}</h3>}
                  {section.type === 'text' && section.body && <p className="project-modal__text">{section.body}</p>}
                  {(section.type === 'diagram' || section.type === 'illustration') && (
                    <figure className={`project-modal__figure project-modal__figure--${section.type}`}>
                      {section.src ? (
                        <img src={section.src} alt={section.alt ?? section.title ?? 'Project illustration'} loading="lazy" />
                      ) : (
                        <div className="project-modal__placeholder" aria-hidden="true">
                          <span>Sketch illustration</span>
                          <small>Coming soon</small>
                        </div>
                      )}
                      {section.caption && <figcaption>{section.caption}</figcaption>}
                    </figure>
                  )}
                </section>
              ))}

              {!activeProject.detail?.sections?.length && (
                <div className="project-modal__empty">
                  <p>This case study is still being written. Check back for the full implementation walkthrough.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <style>{`
        .project-showcase {
          position: relative;
        }

        .project-showcase__controls {
          display: none;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }

        @media (min-width: 768px) {
          .project-showcase__controls {
            display: flex;
          }
        }

        .project-showcase__nav {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--color-text-muted);
          font-family: var(--font-mono);
          cursor: pointer;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
        }

        .project-showcase__nav:hover {
          border-color: var(--color-border-accent);
          color: var(--color-text);
          background: rgba(59, 130, 246, 0.08);
        }

        .project-rail {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 0.5rem;
          padding: 0.25rem 0.5rem 1rem;
          margin-inline: -0.5rem;
          mask-image: linear-gradient(90deg, transparent, black 3%, black 97%, transparent);
          -webkit-overflow-scrolling: touch;
        }

        .project-rail::-webkit-scrollbar {
          height: 6px;
        }

        .project-rail::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
        }

        .project-tile {
          flex: 0 0 min(82vw, 300px);
          scroll-snap-align: start;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          min-height: 240px;
          padding: 1.35rem;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background:
            radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--tile-accent) 14%, transparent), transparent 48%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
          color: var(--color-text);
          cursor: pointer;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }

        .project-tile:hover {
          border-color: color-mix(in srgb, var(--tile-accent) 45%, var(--color-border));
          transform: translateY(-3px);
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24);
        }

        .project-tile__index {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: var(--tile-accent);
        }

        .project-tile__title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--color-text);
        }

        .project-tile__summary {
          flex: 1;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--color-text-muted);
        }

        .project-tile__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .project-tile__tag {
          font-family: var(--font-mono);
          font-size: 0.64rem;
          padding: 0.28rem 0.55rem;
          border-radius: 4px;
          border: 1px solid color-mix(in srgb, var(--tile-accent) 35%, rgba(255, 255, 255, 0.12));
          background: color-mix(in srgb, var(--tile-accent) 12%, rgba(255, 255, 255, 0.04));
          color: #f8fafc;
        }

        .project-tile__cta {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          color: #ffffff;
          opacity: 0.92;
        }

        .project-tile:hover .project-tile__cta {
          opacity: 1;
          color: color-mix(in srgb, var(--tile-accent) 35%, #ffffff);
        }

        .project-showcase__hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-mono);
        }

        .project-showcase__hint-icon {
          color: var(--color-accent);
        }

        .project-modal {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 1rem;
        }

        .project-modal__backdrop {
          position: absolute;
          inset: 0;
          border: none;
          background: rgba(4, 4, 6, 0.78);
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        .project-modal__panel {
          position: relative;
          z-index: 1;
          width: min(100%, 860px);
          max-height: min(88vh, 920px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-accent);
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.12), transparent 40%),
            linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
        }

        .project-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.35rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .project-modal__label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 0.35rem;
        }

        .project-modal__title {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 3vw, 1.65rem);
          font-weight: 600;
          line-height: 1.25;
        }

        .project-modal__close {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.03);
          color: var(--color-text-muted);
          font-size: 1.35rem;
          line-height: 1;
          cursor: pointer;
          transition: border-color 0.25s, color 0.25s;
        }

        .project-modal__close:hover {
          border-color: var(--color-border-accent);
          color: var(--color-text);
        }

        .project-modal__body {
          overflow-y: auto;
          padding: 1.35rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .project-modal__overview {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--color-text-muted);
        }

        .project-modal__highlights {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-left: 0;
          list-style: none;
        }

        .project-modal__highlights li {
          position: relative;
          padding-left: 1.1rem;
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }

        .project-modal__highlights li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--color-accent);
          font-size: 0.72rem;
        }

        .project-modal__section-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.65rem;
        }

        .project-modal__text {
          font-size: 0.94rem;
          line-height: 1.75;
          color: var(--color-text-muted);
        }

        .project-modal__figure {
          margin: 0;
          position: relative;
        }

        .project-modal__figure--diagram,
        .project-modal__figure--illustration {
          padding: 0.5rem;
          border-radius: calc(var(--radius-md) + 2px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.015);
        }

        .project-modal__figure img {
          width: 100%;
          display: block;
          border-radius: var(--radius-md);
          border: none;
          background: #0b0b10;
        }

        .project-modal__figure figcaption {
          margin-top: 0.55rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-mono);
        }

        .project-modal__placeholder {
          display: grid;
          place-items: center;
          gap: 0.35rem;
          min-height: 220px;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px dashed var(--color-border-accent);
          background: rgba(59, 130, 246, 0.04);
          text-align: center;
        }

        .project-modal__placeholder span {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--color-text);
        }

        .project-modal__placeholder small {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-mono);
        }

        .project-modal__empty {
          padding: 1rem 1.1rem;
          border-radius: var(--radius-md);
          border: 1px dashed var(--color-border);
          background: rgba(255, 255, 255, 0.02);
        }

        .project-modal__empty p {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
