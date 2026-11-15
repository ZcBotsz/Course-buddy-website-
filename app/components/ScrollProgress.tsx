'use client';
import { useEffect } from 'react';
export function ScrollProgress() { useEffect(() => { const h = () => { const max = document.documentElement.scrollHeight - window.innerHeight; document.documentElement.style.setProperty('--progress', max > 0 ? `${(window.scrollY / max) * 100}%` : '0%'); }; h(); window.addEventListener('scroll', h, { passive: true }); window.addEventListener('resize', h); return () => { window.removeEventListener('scroll', h); window.removeEventListener('resize', h); }; }, []); return <div className="cb-scroll-progress" aria-hidden />; }
