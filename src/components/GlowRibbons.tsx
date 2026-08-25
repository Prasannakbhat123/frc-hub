import { motion } from 'motion/react';

/** Hero backdrop: mid-field odds chart with green→blue stroke */
export function GlowRibbons({ intensity = 'hero' }: { intensity?: 'hero' | 'subtle' }) {
  const isHero = intensity === 'hero';

  return (
    <div
      aria-hidden
      className={
        isHero
          ? 'pointer-events-none absolute inset-0 overflow-hidden'
          : 'pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30'
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_70%,rgba(33,217,0,0.14),transparent_65%)]" />

      <motion.svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          <linearGradient id="fec-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#21d900" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#171717" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fec-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#21d900" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#21d900" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#7eb6ff" />
            <stop offset="100%" stopColor="#5b9dff" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {[280, 360, 440, 520, 600].map((y) => (
          <line
            key={y}
            x1="0"
            x2="1440"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="1"
          />
        ))}

        <path
          d="M0 560 C160 510 240 300 390 325 C550 355 610 560 770 470 C930 380 990 210 1150 245 C1270 270 1360 400 1440 370 L1440 900 L0 900 Z"
          fill="url(#fec-area)"
        />

        <path
          d="M0 580 C200 555 280 430 430 450 C610 480 700 590 860 520 C1020 450 1140 360 1440 400"
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
        />

        <path
          d="M0 560 C160 510 240 300 390 325 C550 355 610 560 770 470 C930 380 990 210 1150 245 C1270 270 1360 400 1440 370"
          fill="none"
          stroke="url(#fec-line)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {[
          [390, 325],
          [770, 470],
          [1150, 245],
        ].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="16" fill="rgba(33,217,0,0.15)" />
            <circle cx={x} cy={y} r="5" fill="#ffffff" />
          </g>
        ))}
      </motion.svg>

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 16 C6 10 9 8 12 11 C15 14 18 13 21 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3 18 C7 14 10 13 13 15 C16 17 19 15 21 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="19.5" cy="8.2" r="1.6" fill="currentColor" />
    </svg>
  );
}
