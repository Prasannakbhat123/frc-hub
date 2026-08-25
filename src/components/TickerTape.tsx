import type { MarketSummary } from '../lib/api';
import { formatPct } from '../lib/api';

export function TickerTape({ markets }: { markets?: MarketSummary[] }) {
  const ticks =
    markets && markets.length > 0
      ? markets.slice(0, 12).map((m) => ({
          s: m.venue === 'kalshi' ? 'KAL' : 'POLY',
          title: m.title.slice(0, 28),
          p: formatPct(m.yesPrice),
          up: m.yesPrice >= 0.5,
        }))
      : [
          { s: 'FED', title: 'Rate path', p: '62.0¢', up: true },
          { s: 'CPI', title: 'Inflation', p: '41.0¢', up: false },
          { s: 'SPX', title: 'Equity range', p: '55.0¢', up: true },
          { s: 'OIL', title: 'Crude', p: '38.0¢', up: false },
          { s: 'NFP', title: 'Jobs', p: '47.0¢', up: true },
        ];

  const row = (prefix: string) => (
    <div className="ticker-track-inner">
      {ticks.map((t, i) => (
        <span key={`${prefix}-${i}`} className="inline-flex items-center gap-1.5 font-mono text-[11px]">
          <span className={t.up ? 'text-live' : 'text-danger'}>{t.up ? '▲' : '▼'}</span>
          <span className="tracking-wide text-muted">{t.s}</span>
          <span className="text-muted">{t.title}</span>
          <span className="text-text">{t.p}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker-tape">
      <span className="shrink-0 text-[12px] text-muted">Financial event odds</span>
      <div className="ticker-track">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
