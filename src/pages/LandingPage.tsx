import { motion } from 'motion/react';
import { ArrowRight, GitCompareArrows, Radio, Shield, Sparkles } from 'lucide-react';
import {
  formatVolume,
  type FeedHealth,
  type MarketSummary,
} from '../lib/api';
// === LANDING_ONLY: restore live backend data — uncomment below ===
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { getFeedHealth, listMarkets, formatVolume, type FeedHealth, type MarketSummary } from '../lib/api';
// === /LANDING_ONLY ===
import { AppHeader, CategoryChip, SiteFooter, VenueChip } from '../components/Layout';
import { GlowRibbons } from '../components/GlowRibbons';
import { TickerTape } from '../components/TickerTape';
import { ProbRing } from '../components/ProbRing';
import { easeOut, fadeUp } from '../components/motion';

const STEPS = [
  {
    icon: Radio,
    title: 'Ingest',
    body: 'Public Kalshi and Polymarket feeds are polled, normalized, and filtered to financial events only.',
  },
  {
    icon: Sparkles,
    title: 'Pool',
    body: 'One finance inventory across venues: rates, macro, equities, energy, FX. No sports clutter.',
  },
  {
    icon: GitCompareArrows,
    title: 'Compare',
    body: 'Open a contract and see related odds on the other venue when titles roughly match.',
  },
  {
    icon: Shield,
    title: 'Read-only',
    body: 'Link out to trade on the source venue. Fec Hub never places orders or holds funds.',
  },
];

/** Static demo inventory for landing-only hosting (no backend). */
const DEMO_PREVIEW: MarketSummary[] = [
  {
    id: 'demo-1',
    venue: 'polymarket',
    externalId: 'demo-1',
    title: 'Will the Fed cut rates at the next FOMC meeting?',
    category: 'rates',
    yesPrice: 0.62,
    volume: 4_200_000,
    liquidity: 180_000,
    url: 'https://polymarket.com',
  },
  {
    id: 'demo-2',
    venue: 'kalshi',
    externalId: 'demo-2',
    title: 'US CPI above 3% this print?',
    category: 'macro',
    yesPrice: 0.41,
    volume: 890_000,
    liquidity: 95_000,
    url: 'https://kalshi.com',
  },
  {
    id: 'demo-3',
    venue: 'polymarket',
    externalId: 'demo-3',
    title: 'US recession by end of 2026?',
    category: 'macro',
    yesPrice: 0.18,
    volume: 2_100_000,
    liquidity: 120_000,
    url: 'https://polymarket.com',
  },
  {
    id: 'demo-4',
    venue: 'kalshi',
    externalId: 'demo-4',
    title: 'S&P 500 range this week',
    category: 'equities',
    yesPrice: 0.55,
    volume: 640_000,
    liquidity: 70_000,
    url: 'https://kalshi.com',
  },
  {
    id: 'demo-5',
    venue: 'polymarket',
    externalId: 'demo-5',
    title: 'Crude oil above $80 by quarter end?',
    category: 'energy',
    yesPrice: 0.37,
    volume: 510_000,
    liquidity: 55_000,
    url: 'https://polymarket.com',
  },
];

const DEMO_FEEDS: FeedHealth[] = [
  { name: 'kalshi', enabled: true, lastSuccessAt: new Date().toISOString(), lastCount: 24 },
  { name: 'polymarket', enabled: true, lastSuccessAt: new Date().toISOString(), lastCount: 32 },
];

export function LandingPage() {
  // === LANDING_ONLY: static demo data (no backend). To restore live feeds:
  // const [feeds, setFeeds] = useState<FeedHealth[]>([]);
  // const [preview, setPreview] = useState<MarketSummary[]>([]);
  // useEffect(() => {
  //   void getFeedHealth().then((r) => setFeeds(r.feeds)).catch(() => setFeeds([]));
  //   void listMarkets({ limit: 16 }).then((r) => setPreview(r.markets)).catch(() => setPreview([]));
  // }, []);
  // === /LANDING_ONLY ===
  const feeds = DEMO_FEEDS;
  const preview = DEMO_PREVIEW;

  const featured = preview.slice(0, 3);
  const spotlight = preview[0];

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex min-h-dvh flex-col overflow-hidden">
        <GlowRibbons intensity="hero" />
        <AppHeader feeds={feeds} />

        <main className="relative z-[2] flex flex-1 flex-col items-center justify-center px-5 pb-8">
          <motion.div
            className="max-w-3xl text-center"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              Financial event contracts
            </p>
            <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] text-text sm:text-[52px] md:text-[64px]">
              <span className="font-display font-normal tracking-tight">Fec Hub</span>
              <br />
              Odds for markets that
              <br />
              <em className="text-soft">move money</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-soft md:text-[18px]">
              Pool Kalshi and Polymarket financial events in one terminal: rates, macro, equities,
              energy. Read-only. No sports noise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45, ease: easeOut }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {/* === LANDING_ONLY: restore <Link to="/inventory"> … </Link> — using #how for showcase === */}
            <a href="#how">
              <motion.span className="hero-cta" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.985 }}>
                See how it works
                <span className="hero-cta-orb">
                  <ArrowRight size={14} strokeWidth={2.2} />
                </span>
              </motion.span>
            </a>
            <a href="#pulse" className="fec-btn fec-btn-ghost">
              View pulse
            </a>
          </motion.div>
        </main>

        <div className="relative z-[2]">
          <TickerTape markets={preview} />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-t border-line py-20 md:py-28">
        <div className="shell-pad">
          <motion.div {...fadeUp} className="mb-12 max-w-xl">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Pipeline
            </p>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-text md:text-[40px]">
              From public feeds to one clear book
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: easeOut }}
                className="fec-panel group rounded-2xl p-5 transition hover:border-line-strong"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg text-live transition group-hover:border-live/40">
                  <step.icon size={16} strokeWidth={1.6} />
                </div>
                <div className="mb-2 font-mono text-[11px] text-muted">0{i + 1}</div>
                <h3 className="text-[16px] font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Venues */}
      <section id="venues" className="relative border-t border-line py-20 md:py-28">
        <div className="shell-pad grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Venues
            </p>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-text md:text-[40px]">
              Two books. One signal field.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              Kalshi brings regulated event contracts. Polymarket brings deep crypto-native
              liquidity. Fec Hub sits in the middle as a read-only lens on financial outcomes.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: 'Kalshi',
                tag: 'venue-kalshi',
                line: 'CFTC-regulated event markets for economics and financials series.',
              },
              {
                name: 'Polymarket',
                tag: 'venue-poly',
                line: 'Gamma public markets for Fed, CPI, recession, and equities queries.',
              },
            ].map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.45, ease: easeOut }}
                className="fec-panel-solid rounded-2xl p-5"
              >
                <span
                  className={`inline-flex rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${v.tag}`}
                >
                  {v.name}
                </span>
                <p className="mt-4 text-[14px] leading-relaxed text-soft">{v.line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live pulse / featured (demo data while landing-only) */}
      <section id="pulse" className="relative border-t border-line py-20 md:py-28">
        <div className="shell-pad">
          <motion.div {...fadeUp} className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                Live pulse
              </p>
              <h2 className="text-[32px] font-semibold tracking-[-0.03em] text-text md:text-[40px]">
                What is in inventory
              </h2>
            </div>
            {/* === LANDING_ONLY: restore <Link to="/inventory">View inventory</Link> === */}
            <a href="#how" className="fec-btn fec-btn-ghost">
              How it works <ArrowRight size={14} />
            </a>
          </motion.div>

          {spotlight ? (
            <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
              <motion.div
                {...fadeUp}
                className="fec-panel relative overflow-hidden rounded-3xl p-6 md:p-8"
              >
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <VenueChip venue={spotlight.venue} />
                  <CategoryChip category={spotlight.category} />
                  <span className="font-mono text-[11px] text-muted">
                    vol {formatVolume(spotlight.volume)}
                  </span>
                </div>
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[22px] font-semibold leading-snug tracking-[-0.02em] text-text md:text-[28px]">
                      {spotlight.title}
                    </h3>
                    {/* === LANDING_ONLY: restore Link to={`/inventory/${spotlight.id}`} === */}
                    <a
                      href={spotlight.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-[13px] text-muted hover:text-text"
                    >
                      View on {spotlight.venue === 'kalshi' ? 'Kalshi' : 'Polymarket'}{' '}
                      <ArrowRight size={13} />
                    </a>
                  </div>
                  <ProbRing value={spotlight.yesPrice} size={120} />
                </div>
              </motion.div>

              <div className="grid gap-4">
                {featured.slice(1).map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.4, ease: easeOut }}
                  >
                    {/* === LANDING_ONLY: restore Link to={`/inventory/${m.id}`} wrapping this card === */}
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="fec-panel-solid flex items-center gap-4 rounded-2xl p-4 transition hover:border-line-strong"
                    >
                      <ProbRing value={m.yesPrice} size={72} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap gap-1.5">
                          <VenueChip venue={m.venue} />
                          <CategoryChip category={m.category} />
                        </div>
                        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-soft">
                          {m.title}
                        </p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="fec-panel rounded-2xl border-dashed px-6 py-16 text-center text-muted">
              Demo pulse unavailable.
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative border-t border-line py-20 md:py-24">
        <motion.div
          {...fadeUp}
          className="shell-pad fec-panel relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(33,217,0,0.08),transparent_65%)]" />
          <div className="relative z-[1]">
            <h2 className="font-display text-[36px] tracking-tight text-text md:text-[48px]">
              Financial events, pooled
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
              Kalshi and Polymarket finance contracts in one read-only hub. Inventory comes next.
            </p>
            {/* === LANDING_ONLY: restore Link to="/inventory" Open inventory CTA === */}
            <a href="#pulse" className="mt-8 inline-flex">
              <motion.span className="hero-cta" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.985 }}>
                See the pulse
                <span className="hero-cta-orb">
                  <ArrowRight size={14} strokeWidth={2.2} />
                </span>
              </motion.span>
            </a>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
