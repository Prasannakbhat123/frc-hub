import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Search } from 'lucide-react';
import {
  getFeedHealth,
  listMarkets,
  formatVolume,
  type FeedHealth,
  type MarketSummary,
} from '../lib/api';
import { CategoryChip, ShellHeader, SiteFooter, VenueChip } from '../components/Layout';
import { GlowRibbons } from '../components/GlowRibbons';
import { ProbRing } from '../components/ProbRing';
import { easeOut } from '../components/motion';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'rates', label: 'Rates' },
  { value: 'macro', label: 'Macro' },
  { value: 'equities', label: 'Equities' },
  { value: 'energy', label: 'Energy' },
  { value: 'fx', label: 'FX' },
  { value: 'other_financial', label: 'Other' },
];

export function MarketsPage() {
  const [feeds, setFeeds] = useState<FeedHealth[]>([]);
  const [markets, setMarkets] = useState<MarketSummary[]>([]);
  const [q, setQ] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (query = q) => {
    setLoading(true);
    setError(null);
    try {
      const [m, f] = await Promise.all([
        listMarkets({
          q: query || undefined,
          venue: venue || undefined,
          category: category || undefined,
          limit: 100,
        }),
        getFeedHealth().catch(() => ({ feeds: [] as FeedHealth[] })),
      ]);
      setMarkets(m.markets ?? []);
      setFeeds(f.feeds ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inventory');
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venue, category]);

  useEffect(() => {
    const t = setTimeout(() => void load(q), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hero = markets[0];
  const rest = markets.slice(1);

  return (
    <div className="relative min-h-dvh">
      <GlowRibbons intensity="subtle" />
      <div className="relative z-[1] flex min-h-dvh flex-col">
        <ShellHeader feeds={feeds} title="Inventory" />

        <main className="shell-pad flex-1 py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-text md:text-[40px]">
                  Inventory
                </h1>
                <p className="mt-2 max-w-lg text-[14px] text-muted">
                  Finance contracts from Kalshi and Polymarket. Rings show implied yes probability.
                </p>
              </div>
              <button type="button" onClick={() => void load()} className="fec-btn fec-btn-ghost">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-line bg-[color-mix(in_srgb,var(--color-bg-panel)_80%,transparent)] p-3 backdrop-blur-md sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Fed, CPI, Nasdaq…"
                  className="fec-input pl-9"
                />
              </label>
              <div className="flex gap-2">
                {(['', 'kalshi', 'polymarket'] as const).map((v) => (
                  <button
                    key={v || 'all'}
                    type="button"
                    onClick={() => setVenue(v)}
                    className={`rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                      venue === v
                        ? 'bg-white text-black'
                        : 'border border-line text-muted hover:text-text'
                    }`}
                  >
                    {v === '' ? 'All' : v === 'kalshi' ? 'Kalshi' : 'Polymarket'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value || 'all'}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition ${
                    category === c.value
                      ? 'bg-live/15 text-live ring-1 ring-live/40'
                      : 'text-muted hover:bg-[var(--fec-hover)] hover:text-soft'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13px] text-danger">
                {error}. Is the API running on port 4100?
              </div>
            )}

            {loading && (
              <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center text-muted">
                Syncing feeds…
              </div>
            )}

            {!loading && !error && markets.length === 0 && (
              <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
                <p className="text-[15px] text-text">No contracts yet</p>
                <p className="mt-2 text-[13px] text-muted">
                  Feeds may still be ingesting. Wait a minute, then refresh.
                </p>
              </div>
            )}

            {!loading && hero && (
              <>
                {/* Spotlight — LIST_ONLY: no detail link */}
                <div className="fec-panel mb-6 block overflow-hidden rounded-3xl p-6 md:p-8">
                  <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-live">
                          Spotlight
                        </span>
                        <VenueChip venue={hero.venue} />
                        <CategoryChip category={hero.category} />
                        {hero.volume > 0 && (
                          <span className="font-mono text-[11px] text-muted">
                            vol {formatVolume(hero.volume)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-[24px] font-semibold leading-snug tracking-[-0.025em] text-text md:text-[32px]">
                        {hero.title}
                      </h2>
                    </div>
                    <ProbRing value={hero.yesPrice} size={140} />
                  </div>
                </div>

                {/* Bento grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {rest.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(i * 0.025, 0.4),
                        duration: 0.4,
                        ease: easeOut,
                      }}
                    >
                      {/* LIST_ONLY: no detail link */}
                      <div className="fec-panel-solid flex h-full flex-col rounded-2xl p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            <VenueChip venue={m.venue} />
                            <CategoryChip category={m.category} />
                          </div>
                          <ProbRing value={m.yesPrice} size={64} />
                        </div>
                        <p className="line-clamp-3 flex-1 text-[14px] font-medium leading-snug text-soft">
                          {m.title}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                          <span>{m.venue}</span>
                          <span>vol {formatVolume(m.volume)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
