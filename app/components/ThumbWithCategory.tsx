export function ThumbWithCategory({ src, alt, category, inline = false }: { src: string; alt: string; category?: { name: string; slug: string } | null; inline?: boolean }) {
  return <div className={inline ? 'relative w-full max-w-md overflow-hidden rounded-xl' : 'relative h-full w-full'}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} loading="lazy" draggable={false} className={inline ? 'w-full rounded-xl object-cover' : 'absolute inset-0 h-full w-full object-cover'} />
    {category ? <span className="absolute bottom-2 left-2 z-[2] rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">#{category.name.replace(/\s*&\s*/g, '&').replace(/\s+/g, '')}</span> : null}
  </div>;
}
