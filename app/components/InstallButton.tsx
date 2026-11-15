'use client';
import { useEffect, useState } from 'react';
import { DownloadIcon } from './Icons';
import { SITE_NAME } from '@/lib/config';
export function InstallButton({ className }: { className?: string }) {
  const [prompt, setPrompt] = useState<any>(null); const [show, setShow] = useState(false);
  useEffect(() => { const h = (e: Event) => { e.preventDefault(); setPrompt(e); }; window.addEventListener('beforeinstallprompt', h); return () => window.removeEventListener('beforeinstallprompt', h); }, []);
  const click = async () => { if (prompt) { prompt.prompt(); await prompt.userChoice; setPrompt(null); } else setShow(true); };
  return <>
    <button type="button" onClick={click} aria-label="Install app" className={className}><DownloadIcon /><span className="hidden sm:inline">Install app</span></button>
    {show ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShow(false)}><div className="cb-modal-panel w-full max-w-sm rounded-2xl border border-border bg-surface p-5" onClick={e => e.stopPropagation()}><h3 className="font-display text-lg font-semibold">Install {SITE_NAME}</h3><p className="mt-2 text-sm text-muted">Use your browser menu and choose “Add to Home Screen” or “Install app”.</p><button type="button" className="mt-4 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-[#fff]" onClick={() => setShow(false)}>Got it</button></div></div> : null}
  </>;
}
