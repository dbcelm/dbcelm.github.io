import { useEffect, useState } from 'react';
import { liveMetricSeeds } from '../data/ops-endpoints';

type MetricState = {
  key: string;
  label: string;
  value: number;
  step: readonly number[];
};

function initMetrics(): MetricState[] {
  return liveMetricSeeds.map((seed) => ({
    key: seed.key,
    label: seed.label,
    value: seed.start,
    step: seed.step,
  }));
}

function formatValue(value: number) {
  return value.toLocaleString('en-US');
}

export default function OpsLiveMetrics() {
  const [metrics, setMetrics] = useState<MetricState[]>(initMetrics);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let tick = 0;
    const interval = window.setInterval(() => {
      setMetrics((current) =>
        current.map((metric) => {
          const delta = metric.step[tick % metric.step.length] ?? 0;
          const next = metric.value + delta;
          return {
            ...metric,
            value: metric.key === 'terraform_plans_on_friday' ? 0 : Math.max(0, next),
          };
        })
      );
      tick += 1;
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="ops-live" aria-live="polite">
      <p className="ops-section-title">Live telemetry (definitely real)</p>
      <ul className="ops-live__list">
        {metrics.map((metric) => (
          <li key={metric.key}>
            <span className="ops-live__label">{metric.label}</span>
            <span className="ops-live__value">{formatValue(metric.value)}</span>
          </li>
        ))}
      </ul>
      <p className="ops-note">Counters are satire. Your Prometheus is not haunted.</p>
      <style>{`
        .ops-live__list {
          list-style: none;
          margin: 0;
          padding: 0;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }
        .ops-live__list li {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .ops-live__label {
          color: var(--color-text-muted);
        }
        .ops-live__value {
          color: #4ade80;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
