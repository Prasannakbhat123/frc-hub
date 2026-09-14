export type FecCategory =
  | 'rates'
  | 'macro'
  | 'equities'
  | 'energy'
  | 'fx'
  | 'other_financial';

export type MarketSummary = {
  id: string;
  venue: 'kalshi' | 'polymarket';
  externalId: string;
  title: string;
  category: FecCategory;
  yesPrice: number;
  volume: number;
  liquidity: number;
  closesAt?: string;
  url: string;
  matchGroupId?: string;
  asOf?: string;
};

export type FeedHealth = {
  name: string;
  enabled: boolean;
  lastSuccessAt?: string;
  lastError?: string;
  lastCount?: number;
};

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function listMarkets(params: {
  q?: string;
  venue?: string;
  category?: string;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.venue) sp.set('venue', params.venue);
  if (params.category) sp.set('category', params.category);
  if (params.limit) sp.set('limit', String(params.limit));
  const qs = sp.toString();
  return getJson<{ markets: MarketSummary[]; count: number }>(
    `/v1/markets${qs ? `?${qs}` : ''}`
  );
}

export function getMarket(id: string) {
  return getJson<{
    market: MarketSummary & { matchTokens?: string[]; meta?: unknown };
    compare: MarketSummary[];
  }>(`/v1/markets/${id}`);
}

export type MarketIntelArticle = {
  title: string;
  summary: string;
  url: string;
  imageUrl?: string | null;
  source?: string | null;
  publishedAt?: string | null;
  relevance: number;
  lean: 'yes' | 'no' | 'neutral';
  leanScore: number;
};

export type MarketIntelTimelineItem = {
  date: string;
  event: string;
};

export type MarketIntelCrossMatch = {
  id: string;
  reason: string;
  confidence: number;
};

export type MarketIntel = {
  marketId: string;
  brief: string;
  resolution: string;
  drivers: string[];
  timeline: MarketIntelTimelineItem[];
  counterargument: string;
  marketLean: number;
  confidence: number;
  staleRisk: 'low' | 'medium' | 'high';
  articles: MarketIntelArticle[];
  crossVenueMatches: MarketIntelCrossMatch[];
  cached: boolean;
};

export function getMarketIntel(id: string) {
  return getJson<MarketIntel>(`/v1/markets/${id}/intel`);
}

export function getFeedHealth() {
  return getJson<{ feeds: FeedHealth[] }>('/v1/health/feeds');
}

export function formatPct(n: number): string {
  if (!Number.isFinite(n)) return '-';
  return `${(n * 100).toFixed(1)}¢`;
}

export function formatVolume(n: number): string {
  if (!n) return '-';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
