import { Link } from 'react-router-dom';
// === LANDING_ONLY: restore inventory nav — uncomment NavLink import usage below ===
// import { Link, NavLink, useParams, Navigate } from 'react-router-dom';
import type { FeedHealth } from '../lib/api';
import { BrandMark } from './GlowRibbons';

export function VenueChip({ venue }: { venue: 'kalshi' | 'polymarket' }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
        venue === 'kalshi' ? 'venue-kalshi' : 'venue-poly'
      }`}
    >
      {venue === 'kalshi' ? 'Kalshi' : 'Polymarket'}
    </span>
  );
}

export function CategoryChip({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded border border-line px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
      {category.replace('_', ' ')}
    </span>
  );
}

export function FeedDot({ feeds }: { feeds?: FeedHealth[] }) {
  const ok = !!feeds?.length && feeds.every((f) => f.lastSuccessAt && !f.lastError);
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ok ? 'bg-live shadow-[0_0_8px_var(--color-live)]' : 'bg-warn'
        }`}
      />
      Feeds {ok ? 'live' : 'warming'}
    </span>
  );
}

export function AppHeader({ feeds }: { feeds?: FeedHealth[] }) {
  return (
    <header className="relative z-[2] flex items-center justify-between px-6 py-5 md:px-10">
      <Link to="/" className="flex items-center gap-2.5 text-text">
        <BrandMark size={22} />
        <span className="font-display text-[20px] tracking-tight">Fec Hub</span>
      </Link>

      <nav className="hidden items-center gap-8 text-[13px] text-muted md:flex">
        <a href="#how" className="hover:text-soft">
          How it works
        </a>
        <a href="#venues" className="hover:text-soft">
          Venues
        </a>
        <a href="#pulse" className="hover:text-soft">
          Pulse
        </a>
        {/* === LANDING_ONLY: restore inventory nav — uncomment below ===
        <NavLink
          to="/inventory"
          className={({ isActive }) => (isActive ? 'text-text' : 'hover:text-soft')}
        >
          Inventory
        </NavLink>
        === /LANDING_ONLY === */}
      </nav>

      <div className="flex items-center gap-4">
        <FeedDot feeds={feeds} />
        {/* === LANDING_ONLY: restore Explore → /inventory — uncomment below, remove #how link ===
        <Link to="/inventory" className="fec-btn fec-btn-ghost text-[13px] py-2 px-4">
          Explore
        </Link>
        === /LANDING_ONLY === */}
        <a href="#how" className="fec-btn fec-btn-ghost text-[13px] py-2 px-4">
          Explore
        </a>
      </div>
    </header>
  );
}

export function ShellHeader({ feeds, title }: { feeds?: FeedHealth[]; title?: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] px-5 py-3.5 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-text">
          <BrandMark size={18} />
          <span className="font-display text-[18px] tracking-tight">Fec Hub</span>
        </Link>
        {title && (
          <>
            <span className="text-line-strong">/</span>
            <span className="text-[13px] text-muted">{title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <FeedDot feeds={feeds} />
        {/* === LANDING_ONLY: restore inventory shell nav — uncomment below ===
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `text-[13px] ${isActive ? 'text-text' : 'text-muted hover:text-soft'}`
          }
        >
          Inventory
        </NavLink>
        === /LANDING_ONLY === */}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-6 py-10 text-[12px] leading-relaxed text-muted md:px-10">
      <div className="shell-pad flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-text">
            <BrandMark size={16} />
            <span className="font-display text-[16px]">Fec Hub</span>
          </div>
          <p className="max-w-xl">
            Read-only financial event inventory from Kalshi and Polymarket. Not a broker, exchange, or
            prediction-market operator. No trades are placed in-app.
          </p>
        </div>
        <p className="font-mono text-[11px] text-muted">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

// === LANDING_ONLY: restore inventory redirect helper — uncomment below ===
// export function InventoryIdRedirect() {
//   const { id } = useParams();
//   return <Navigate to={`/inventory/${id}`} replace />;
// }
// === /LANDING_ONLY ===
