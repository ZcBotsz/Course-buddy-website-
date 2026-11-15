'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { WatchlistItem } from '@/lib/types';
const KEY = 'course-buddy-2-watchlist';
type Ctx = { items: WatchlistItem[]; ready: boolean; count: number; isSaved: (id: string) => boolean; toggle: (item: WatchlistItem) => void };
const WatchlistContext = createContext<Ctx | null>(null);
export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {} setReady(true); }, []);
  const isSaved = useCallback((id: string) => items.some(i => i.id === id), [items]);
  const toggle = useCallback((item: WatchlistItem) => { setItems(prev => { const next = prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [item, ...prev]; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} return next; }); }, []);
  const value = useMemo(() => ({ items, ready, count: items.length, isSaved, toggle }), [items, ready, isSaved, toggle]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}
export function useWatchlist() { const ctx = useContext(WatchlistContext); if (!ctx) throw new Error('useWatchlist outside provider'); return ctx; }
