import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import {
  getFeedHealth,
  getMarket,
  formatPct,
  formatVolume,
  type FeedHealth,
  type MarketSummary,
} from '../lib/api';
import { CategoryChip, ShellHeader, SiteFooter, VenueChip } from '../components/Layout';
import { GlowRibbons } from '../components/GlowRibbons';
import { ProbRing } from '../components/ProbRing';
import { easeOut } from '../components/motion';

export function MarketDetailPage() {
  const { id } = useParams();
  const [feeds, setFeeds] = useState<FeedHealth[]>([]);
  const [market, setMarket] = useState<(MarketSummary & { matchTokens?: string[] }) | null>(null);
  const [compare, setCompare] = useState<MarketSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    void Promise.all([getMarket(id), getFeedHealth()])
      .then(([m, f]) => {
        setMarket(m.market);
        setCompare(m.compare);
        setFeeds(f.feeds);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load');
        setMarket(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const opposite = compare.filter((c) => c.venue !== market?.venue);

  return (
    <div className="relative min-h-dvh">
      <GlowRibbons intensity="subtle" />
      <div className="relative z-[1] flex min-h-dvh flex-col">
        <ShellHeader feeds={feeds} title="Inventory" />

        <main className="shell-pad flex-1 py-8 md:py-10">
          <Link
            to="/inventory"
            className="mb-6 inline-flex items-center gap-2 text-[13px] text-muted hover:text-text"
          >
            <ArrowLeft size={14} /> Inventory
          </Link>

          {loading && (
            <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center text-muted">
              Loading contract…
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13px] text-danger">
              {error}
            </div>
          )}

          {!loading && market && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <div className="fec-panel rounded-3xl p-6 md:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  <VenueChip venue={market.venue} />
                  <CategoryChip category={market.category} />
                </div>

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <h1 className="max-w-3xl text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-text md:text-[36px]">
                      {market.title}
                    </h1>
                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      <Stat label="Yes" value={formatPct(market.yesPrice)} live />
                      <Stat label="Volume" value={formatVolume(market.volume)} />
                      <Stat
                        label="Closes"
                        value={
                          market.closesAt
                            ? new Date(market.closesAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '-'
                        }
                      />
                    </div>
                    {market.url && (
                      <a href={market.url} target="_blank" rel="noreferrer" className="hero-cta mt-8">
                        Open on {market.venue === 'kalshi' ? 'Kalshi' : 'Polymarket'}
                        <span className="hero-cta-orb">
                          <ExternalLink size={13} strokeWidth={2.2} />
                        </span>
                      </a>
                    )}
                  </div>
                  <ProbRing value={market.yesPrice} size={160} />
                </div>
              </div>

              <section className="mt-10">
                <h2 className="text-[22px] font-semibold tracking-tight text-text">Cross-venue</h2>
                <p className="mt-1 text-[13px] text-muted">
                  Heuristic title match. Related, not guaranteed same event.
                </p>

                {opposite.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-line px-5 py-10 text-[13px] text-muted">
                    No cross-venue match found for this contract yet.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <ComparePanel label="This venue" market={market} active />
                    <ComparePanel label="Related venue" market={opposite[0]} />
                  </div>
                )}

                {opposite.length > 1 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {opposite.slice(1).map((m) => (
                      <Link
                        key={m.id}
                        to={`/inventory/${m.id}`}
                        className="fec-panel-solid flex items-center gap-4 rounded-2xl p-4 transition hover:border-line-strong"
                      >
                        <ProbRing value={m.yesPrice} size={64} />
                        <div className="min-w-0">
                          <VenueChip venue={m.venue} />
                          <p className="mt-2 line-clamp-2 text-[13px] text-soft">{m.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function Stat({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-bg px-4 py-3.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p
        className={`mt-1 font-mono text-[22px] font-medium tabular-nums tracking-tight ${
          live ? 'text-live' : 'text-text'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ComparePanel({
  label,
  market,
  active,
}: {
  label: string;
  market: MarketSummary;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active ? 'border-live/35 bg-live/5' : 'border-line bg-bg-elevated'
      }`}
    >
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="flex items-start gap-4">
        <ProbRing value={market.yesPrice} size={88} />
        <div className="min-w-0 flex-1">
          <VenueChip venue={market.venue} />
          <p className="mt-3 text-[14px] font-medium leading-snug text-soft">{market.title}</p>
          {market.url && (
            <a
              href={market.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-text"
            >
              View source <ExternalLink size={11} />
            </a>
          )}
          {!active && (
            <Link
              to={`/inventory/${market.id}`}
              className="mt-2 block text-[12px] text-accent hover:underline"
            >
              Open in Fec Hub
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
