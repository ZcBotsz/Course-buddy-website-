import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '@/styles/original.css';
import '@/styles/globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/config';
import { Providers } from './components/Providers';
import { SiteHeader } from './components/SiteHeader';
import { BottomTabBar } from './components/BottomTabBar';
import { ChatButton } from './components/ChatButton';
import { CategoriesModal } from './components/CategoriesModal';
import { ScrollProgress } from './components/ScrollProgress';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: '/manifest.webmanifest',
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, siteName: SITE_NAME, type: 'website', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION, images: ['/og.png'] },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: 'default' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#f3effa' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full flex flex-col bg-background text-foreground"><Providers><div className="relative flex min-h-screen flex-1 flex-col"><ScrollProgress /><SiteHeader /><main className="mb-16 mt-6 w-full flex-1 px-4 sm:px-6"><Suspense fallback={null}>{children}</Suspense></main><BottomTabBar /><ChatButton /><CategoriesModal /></div></Providers></body></html>;
}
