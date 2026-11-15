'use client';
import type { ReactNode } from 'react';
import { WatchlistProvider } from './WatchlistProvider';
import { CategoriesProvider } from './CategoriesProvider';
export function Providers({ children }: { children: ReactNode }) { return <WatchlistProvider><CategoriesProvider>{children}</CategoriesProvider></WatchlistProvider>; }
