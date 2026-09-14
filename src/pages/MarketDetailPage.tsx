import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, CalendarClock, ExternalLink, Scale, Sparkles, Zap } from 'lucide-react';
import {
  getFeedHealth,
  getMarket,
  getMarketIntel,
  formatPct,
  formatVolume,
  type FeedHealth,
  type MarketIntel,
  type MarketIntelArticle,
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
  const [intel, setIntel] = useState<MarketIntel | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelError, setIntelError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setIntel(null);
    setIntelError(null);
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

  useEffect(() => {
    if (!id || !market) return;
    setIntelLoading(true);
    setIntelError(null);
    void getMarketIntel(id)
      .then((data) => {
        setIntel(data);
        setIntelError(null);
      })
      .catch((e) => {
        setIntel(null);
        setIntelError(e instanceof Error ? e.message : 'Failed to load AI context');
      })
      .finally(() => setIntelLoading(false));
  }, [id, market]);

  const oppositeHeuristic = compare.filter((c) => c.venue !== market?.venue);
  const [aiExtras, setAiExtras] = useState<MarketSummary[]>([]);

  useEffect(() => {
    if (!intel?.crossVenueMatches?.length) {
      setAiExtras([]);
      return;
    }
    const known = new Set([...compare, ...oppositeHeuristic].map((m) => m.id));
    const missing = intel.crossVenueMatches.map((m) => m.id).filter((mid) => !known.has(mid));
    if (!missing.length) {
      setAiExtras([]);
      return;
    }
    let cancelled = false;
    void Promise.all(
      missing.slice(0, 5).map((mid) =>
        getMarket(mid)
          .then((r) => r.market)
          .catch(() => null)
      )
    ).then((rows) => {
      if (cancelled) return;
      setAiExtras(rows.filter((r): r is NonNullable<typeof r> => !!r));
    });
    return () => {
      cancelled = true;
    };
  }, [intel, compare, oppositeHeuristic]);

  const crossVenueResolved = useMemo(() => {
    if (!intel?.crossVenueMatches?.length) {
      return oppositeHeuristic.map((m) => ({
        market: m,
        reason: 'Heuristic title match',
        confidence: null as number | null,
        ai: false,
      }));
    }
    const byId = new Map<string, MarketSummary>();
    for (const m of [...compare, ...oppositeHeuristic, ...aiExtras]) byId.set(m.id, m);

    const rows = intel.crossVenueMatches
      .map((match) => {
        const found = byId.get(match.id);
        if (!found) return null;
        return {
          market: found,
          reason: match.reason,
          confidence: match.confidence,
          ai: true,
        };
      })
      .filter((r): r is NonNullable<typeof r> => !!r);

    if (rows.length === 0) {
      return oppositeHeuristic.map((m) => ({
        market: m,
        reason: 'Heuristic title match',
        confidence: null as number | null,
        ai: false,
      }));
    }
    return rows;
  }, [intel, compare, oppositeHeuristic, aiExtras]);

  return (
    <div className="relative min-h-dvh">
      <GlowRibbons intensity="subtle" />
      <div className="relative z-[1] flex min-h-dvh flex-col">
        <ShellHeader feeds={feeds} title="Inventory" />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:px-10">
          <Link
            to="/inventory"
            className="mb-8 inline-flex items-center gap-2 text-[13px] text-muted transition hover:text-text"
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
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <VenueChip venue={market.venue} />
                  <CategoryChip category={market.category} />
                </div>
                <h1 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-text md:text-[36px]">
                  {market.title}
                </h1>

                <div className="mt-8 flex flex-col items-stretch gap-6 rounded-3xl border border-line bg-bg-panel p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
                  <div className="flex justify-center sm:justify-start">
                    <ProbRing value={market.yesPrice} size={112} />
                  </div>

                  <div className="grid min-w-0 flex-1 grid-cols-3 gap-4 border-t border-line pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                        Yes
                      </p>
                      <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-live md:text-[26px]">
                        {formatPct(market.yesPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                        Volume
                      </p>
                      <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-text md:text-[26px]">
                        {formatVolume(market.volume)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                        Closes
                      </p>
                      <p className="mt-1 text-[15px] font-medium leading-snug text-text md:text-[17px]">
                        {market.closesAt
                          ? new Date(market.closesAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>

                  {market.url && (
                    <a
                      href={market.url}
                      target="_blank"
                      rel="noreferrer"
                      className="fec-btn fec-btn-ghost shrink-0 self-stretch justify-center sm:self-center"
                    >
                      Open venue <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                {/* AI context — single column */}
                <section className="mt-10 border-t border-line pt-10">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-live/30 bg-live/10 text-live">
                        <Sparkles size={14} />
                      </span>
                      <div>
                        <h2 className="text-[18px] font-semibold tracking-tight text-text">
                          AI context
                        </h2>
                        <p className="text-[12px] text-muted">
                          Live web search · not financial advice
                        </p>
                      </div>
                    </div>
                    {intel?.cached && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        Cached
                      </span>
                    )}
                  </div>

                  {intelLoading && (
                    <div className="space-y-3">
                      <div className="h-28 animate-pulse rounded-2xl border border-line bg-bg-panel/70" />
                      <div className="h-20 animate-pulse rounded-2xl border border-line bg-bg-panel/50" />
                      <div className="h-20 animate-pulse rounded-2xl border border-line bg-bg-panel/40" />
                    </div>
                  )}

                  {!intelLoading && intelError && (
                    <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-[13px] text-danger">
                      {intelError}
                    </div>
                  )}

                  {!intelLoading && !intelError && intel && (
                    <div className="space-y-5">
                      <div className="overflow-hidden rounded-2xl border border-line bg-bg-panel">
                        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
                          <div className="min-w-0 border-b border-line p-5 md:border-b-0 md:border-r md:p-6 lg:p-7">
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                              Brief
                            </p>
                            <p className="mt-3 break-words text-[15px] leading-relaxed text-soft [overflow-wrap:anywhere]">
                              {intel.brief}
                            </p>
                          </div>
                          <div className="flex flex-col justify-center gap-5 border-live/20 bg-gradient-to-b from-live/[0.07] to-transparent px-5 py-6 md:px-7 md:py-7">
                            <LeanPanel value={intel.marketLean} compact />
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                                Confidence
                              </p>
                              <div className="mt-2.5 flex items-center gap-3">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                                  <div
                                    className="h-full rounded-full bg-accent"
                                    style={{
                                      width: `${Math.max(4, Math.min(100, intel.confidence ?? 50))}%`,
                                    }}
                                  />
                                </div>
                                <span className="font-mono text-[16px] font-semibold tabular-nums text-text">
                                  {Math.round(intel.confidence ?? 50)}
                                </span>
                              </div>
                              <p className="mt-3 text-[12px] text-muted">
                                Stale risk:{' '}
                                <span className="font-medium text-soft capitalize">
                                  {intel.staleRisk || 'medium'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {intel.resolution && (
                        <div className="rounded-2xl border border-line bg-bg-panel p-5 md:px-6 md:py-5">
                          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                            What YES means
                          </p>
                          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-soft">
                            {intel.resolution}
                          </p>
                        </div>
                      )}

                      {(intel.drivers?.length > 0 || intel.timeline?.length > 0) && (
                        <div className="grid gap-4 lg:grid-cols-2">
                          {intel.drivers?.length > 0 && (
                            <div className="rounded-2xl border border-line bg-bg-panel p-5 md:p-6">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-live/25 bg-live/10 text-live">
                                    <Zap size={14} strokeWidth={1.8} />
                                  </span>
                                  <div>
                                    <p className="text-[13px] font-semibold text-text">Drivers</p>
                                    <p className="text-[11px] text-muted">What can move YES/NO</p>
                                  </div>
                                </div>
                                <span className="font-mono text-[11px] tabular-nums text-muted">
                                  {intel.drivers.length}
                                </span>
                              </div>
                              <ul className="space-y-2">
                                {intel.drivers.map((d, i) => (
                                  <li
                                    key={i}
                                    className="group flex gap-3 rounded-xl border border-line bg-bg/70 px-3.5 py-3 transition hover:border-live/30 hover:bg-live/[0.04]"
                                  >
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-live/20 bg-live/10 font-mono text-[10px] text-live">
                                      {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[13px] leading-snug text-soft group-hover:text-text">
                                      {d}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {intel.timeline?.length > 0 && (
                            <div className="rounded-2xl border border-line bg-bg-panel p-5 md:p-6">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                                    <CalendarClock size={14} strokeWidth={1.8} />
                                  </span>
                                  <div>
                                    <p className="text-[13px] font-semibold text-text">Timeline</p>
                                    <p className="text-[11px] text-muted">Upcoming catalysts</p>
                                  </div>
                                </div>
                                <span className="font-mono text-[11px] tabular-nums text-muted">
                                  {intel.timeline.length}
                                </span>
                              </div>
                              <ol className="relative ml-3 space-y-0 border-l border-line pl-5">
                                {intel.timeline.map((t, i) => (
                                  <li key={i} className="relative pb-5 last:pb-0">
                                    <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg-panel bg-accent shadow-[0_0_10px_rgba(61,139,253,0.45)]" />
                                    <div className="rounded-xl border border-line bg-bg/70 px-3.5 py-3 transition hover:border-accent/30">
                                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                                        {t.date}
                                      </p>
                                      <p className="mt-1.5 text-[13px] leading-snug text-soft">
                                        {t.event}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      )}

                      {intel.counterargument && (
                        <div className="relative overflow-hidden rounded-2xl border border-danger/25 bg-bg-panel">
                          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,92,92,0.12),transparent_70%)]" />
                          <div className="relative flex gap-4 p-5 md:gap-5 md:p-6">
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-danger/30 bg-danger/10 text-danger">
                              <Scale size={16} strokeWidth={1.8} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[13px] font-semibold text-text">
                                  Counterargument
                                </p>
                                <span className="rounded border border-danger/25 bg-danger/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-danger">
                                  Opposing case
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] text-muted">
                                Strongest case against the current lean
                              </p>
                              <p className="mt-3 text-[14px] leading-relaxed text-soft">
                                {intel.counterargument}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                            Coverage
                          </p>
                          <span className="font-mono text-[11px] text-muted">
                            {intel.articles.length}
                          </span>
                        </div>

                        {intel.articles.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-[13px] text-muted">
                            No sourced articles for this contract.
                          </div>
                        ) : (
                          <div className="overflow-hidden rounded-2xl border border-line">
                            {intel.articles.map((article, i) => (
                              <ArticleRow
                                key={article.url}
                                article={article}
                                last={i === intel.articles.length - 1}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </section>

                {/* Cross-venue */}
                <section className="mt-10 border-t border-line pt-10">
                  <h2 className="text-[18px] font-semibold tracking-tight text-text">
                    Cross-venue
                  </h2>
                  <p className="mt-1 text-[13px] text-muted">
                    {crossVenueResolved.some((r) => r.ai)
                      ? 'AI-matched contracts on the other book'
                      : 'Heuristic title match on the other book'}
                  </p>

                  {intelLoading && crossVenueResolved.length === 0 ? (
                    <div className="mt-4 h-24 animate-pulse rounded-2xl border border-line bg-bg-panel/50" />
                  ) : crossVenueResolved.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-line px-4 py-10 text-center text-[13px] text-muted">
                      No cross-venue match found for this contract yet.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {crossVenueResolved.map(({ market: m, reason, confidence, ai }) => (
                        <Link
                          key={m.id}
                          to={`/inventory/${m.id}`}
                          className="fec-panel-solid group flex flex-col rounded-2xl p-4 transition hover:border-line-strong"
                        >
                          <div className="flex items-center gap-4">
                            <ProbRing value={m.yesPrice} size={64} />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <VenueChip venue={m.venue} />
                                {ai && (
                                  <span className="rounded border border-live/25 bg-live/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-live">
                                    AI
                                    {confidence != null ? ` ${Math.round(confidence)}` : ''}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug text-soft group-hover:text-text">
                                {m.title}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 line-clamp-2 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
                            {reason}
                          </p>
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

function LeanPanel({ value, compact }: { value: number; compact?: boolean }) {
  const clamped = Math.max(-100, Math.min(100, Math.round(value)));
  const pct = ((clamped + 100) / 200) * 100;
  const label = clamped > 15 ? 'YES' : clamped < -15 ? 'NO' : 'NEUTRAL';
  const tone =
    clamped > 15 ? 'text-live' : clamped < -15 ? 'text-danger' : 'text-muted';

  return (
    <div className={compact ? 'space-y-3' : 'flex w-full shrink-0 flex-col justify-center gap-3 bg-bg/40 px-5 py-5 md:w-52 md:px-6'}>
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">Lean</p>
      <div>
        <p
          className={`font-display leading-none tracking-tight ${tone} ${
            compact ? 'text-[40px]' : 'text-[32px]'
          }`}
        >
          {label}
        </p>
        <p className={`mt-1.5 font-mono text-[15px] tabular-nums ${tone}`}>
          {clamped > 0 ? '+' : ''}
          {clamped}
        </p>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-line">
        <div className="absolute inset-0 bg-gradient-to-r from-danger/60 via-white/15 to-live/60" />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-text bg-bg shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted">
        <span>NO</span>
        <span>YES</span>
      </div>
    </div>
  );
}

function ArticleRow({
  article,
  last,
}: {
  article: MarketIntelArticle;
  last?: boolean;
}) {
  const leanTone =
    article.lean === 'yes'
      ? 'text-live bg-live/10 border-live/25'
      : article.lean === 'no'
        ? 'text-danger bg-danger/10 border-danger/25'
        : 'text-muted bg-bg border-line';

  const host = (() => {
    try {
      return new URL(article.url).hostname.replace(/^www\./, '');
    } catch {
      return article.source || 'source';
    }
  })();

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className={`group flex items-start gap-4 bg-bg-panel px-4 py-4 transition hover:bg-white/[0.03] md:px-5 ${
        last ? '' : 'border-b border-line'
      }`}
    >
      <div
        className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${leanTone}`}
      >
        {article.lean}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
          <span className="font-medium text-soft">{article.source || host}</span>
          <span aria-hidden>·</span>
          <span className="font-mono tabular-nums">{Math.round(article.relevance)}% rel</span>
        </div>
        <p className="mt-1 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-text group-hover:text-soft">
          {article.title}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {article.summary}
        </p>
      </div>

      <ArrowUpRight
        size={15}
        className="mt-1 shrink-0 text-muted transition group-hover:text-text"
      />
    </a>
  );
}
