import { getAccessUrl } from '@/lib/config';
import { TelegramIcon } from './Icons';
export function GetAccessButton({ title, compact = false, className }: { title: string; compact?: boolean; className?: string }) {
  const cls = className ?? (compact ? 'inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-4 py-2 text-sm font-semibold text-[#fff] shadow-lg transition-colors duration-200 hover:bg-gold-soft' : 'inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-gold px-5 py-3 font-semibold text-[#fff] transition-colors duration-200 hover:bg-gold-soft');
  return <a href={getAccessUrl(title)} target="_blank" rel="noopener noreferrer" className={cls} data-testid="get-access"><TelegramIcon className={compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />Get Access</a>;
}
