import { useEffect, useState } from 'react';

export default function PageIntro() {
  const [visible, setVisible] = useState(true);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (skipped || !visible) return null;

  return (
    <div className="page-intro" role="presentation">
      <button
        className="page-intro__skip"
        onClick={() => setSkipped(true)}
        aria-label="Skip intro animation"
      >
        Skip
      </button>
      <div className="page-intro__content">
        <span className="page-intro__label">Initializing</span>
        <div className="page-intro__bar">
          <div className="page-intro__fill" />
        </div>
      </div>
      <style>{`
        .page-intro {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0b;
          animation: fadeOut 0.6s ease 1.8s forwards;
        }
        .page-intro__skip {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: rgba(245, 245, 245, 0.5);
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          padding: 0.4rem 1rem;
          cursor: pointer;
        }
        .page-intro__skip:hover {
          color: #f5f5f5;
          border-color: rgba(59, 130, 246, 0.5);
        }
        .page-intro__content {
          width: min(280px, 80vw);
          text-align: center;
        }
        .page-intro__label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: #3b82f6;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 1rem;
        }
        .page-intro__bar {
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1px;
          overflow: hidden;
        }
        .page-intro__fill {
          height: 100%;
          background: #3b82f6;
          animation: loadBar 1.6s ease forwards;
        }
        @keyframes loadBar {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}
