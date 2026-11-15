'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';
export function CategoryPills() { const pathname = usePathname(); const active = pathname.startsWith('/category/') ? pathname.split('/')[2] : null; return <div className="mb-6 flex flex-wrap gap-2">{categories.map(c => <Link key={c.id} href={`/category/${c.slug}`} className={`flex items-center gap-3 rounded-full border px-5 py-2.5 text-[15px] transition-all duration-200 ${active === c.slug ? 'border-gold bg-gold font-semibold text-background shadow-[0_4px_20px_rgba(202,138,4,0.25)]' : 'border-white/15 text-white/80 hover:border-white/40 hover:bg-white/[0.03] hover:text-white'}`}>{c.name}<span className="text-xs opacity-75">{c.count}</span></Link>)}</div>; }
