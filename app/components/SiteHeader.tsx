'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_NAME } from '@/lib/config';
import { HomeIcon } from './Icons';
import { InstallButton } from './InstallButton';
const base = 'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 font-medium transition-colors sm:px-3';
export function SiteHeader() {
  const pathname = usePathname();
  const words = SITE_NAME.trim().split(' ');
  const accent = words.pop();
  const lead = words.join(' ');
  return <header className="sticky top-0 z-40 bg-gradient-to-b from-background via-background/90 to-transparent px-3 pb-3 pt-3 sm:px-6">
    <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface/75 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
      <Link href="/" className="font-heading shrink-0 text-base text-foreground transition-colors hover:text-gold-soft sm:text-lg">{lead ? `${lead} ` : ''}<span className="text-gold-soft">{accent}</span></Link>
      <nav className="flex min-w-0 items-center justify-end gap-1 overflow-x-auto text-sm text-muted sm:gap-2">
        <Link href="/" aria-label="Home" className={`relative max-md:hidden ${base} ${pathname === '/' ? 'text-gold-soft' : 'text-white/70 hover:text-white'}`}><HomeIcon className="h-5 w-5" /><span className="hidden sm:inline">Home</span></Link>
        <InstallButton className={`${base} text-white/70 hover:text-white`} />
      </nav>
    </div>
  </header>;
}
