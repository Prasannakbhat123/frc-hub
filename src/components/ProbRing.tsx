import { motion } from 'motion/react';
import { formatPct } from '../lib/api';

const R = 42;
const C = 2 * Math.PI * R;

/** Circular implied-probability meter */
export function ProbRing({
  value,
  size = 88,
  className = '',
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const v = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0;
  const offset = C * (1 - v);

  return (
    <div className={`relative inline-grid place-items-center ${className}`}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-line"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${C} ${C}`}
          className="text-live"
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-mono text-[15px] font-medium tabular-nums tracking-tight text-text">
          {formatPct(v)}
        </span>
      </div>
    </div>
  );
}
