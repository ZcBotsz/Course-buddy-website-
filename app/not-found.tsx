import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-display text-5xl text-gold-soft">404</p>
      <h1 className="mt-3 font-display text-2xl text-foreground">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-sm text-muted">It may have been moved or removed.</p>
      <Link href="/" className="mt-6 cursor-pointer rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background transition-colors duration-200 hover:bg-gold-soft">Go home</Link>
    </div>
  );
}
