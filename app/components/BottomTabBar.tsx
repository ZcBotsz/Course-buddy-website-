'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CHAT_URL } from '@/lib/config';
import { useWatchlist } from './WatchlistProvider';
import { useCategories } from './CategoriesProvider';
import { BookmarkIcon, GridIcon, HomeIcon } from './Icons';
const tab = 'relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-[11px] font-medium transition-colors';
export function BottomTabBar() {
  const pathname = usePathname() ?? '/'; const router = useRouter(); const { count } = useWatchlist(); const { open, setOpen } = useCategories();
  const home = pathname === '/' && !open; const cats = open || pathname.startsWith('/category/'); const watch = pathname.startsWith('/watchlist') && !open;
  const color = (a: boolean) => a ? 'text-gold-soft' : 'text-white/60 active:text-white';
  const openCats = () => { if (pathname === '/' || ['/category/', '/course/', '/search', '/updates'].some(p => pathname.startsWith(p))) setOpen(true); else router.push('/?categories=1'); };
  return <>
    <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-stretch">
        <Link href="/" className={`${tab} ${color(home)}`} aria-current={home ? 'page' : undefined}><HomeIcon filled={home} className="h-6 w-6" />Home</Link>
        <button type="button" onClick={openCats} className={`${tab} ${color(cats)}`}><GridIcon filled={cats} className="h-6 w-6" />Categories</button>
        <Link href="/watchlist" className={`${tab} ${color(watch)}`} aria-current={watch ? 'page' : undefined}><span className="relative"><BookmarkIcon filled={watch || count > 0} className="h-6 w-6" />{count > 0 ? <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-gold px-1 text-center text-[10px] font-bold leading-4 text-[#fff]">{count}</span> : null}</span>Watchlist</Link>
        <a href={CHAT_URL} target="_blank" rel="noopener noreferrer" className={`${tab} text-[#229ED9]`} data-testid="chat-link"><span className="relative"><img src="/buddy-avatar.webp" alt="" width={32} height={32} className="-my-1 h-8 w-8 rounded-full object-cover ring-1 ring-[#229ED9]/50" /><span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" /></span></span>Chat</a>
      </div>
    </nav>
  </>;
}
