'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const CategoriesContext = createContext<Ctx>({ open: false, setOpen: () => {} });
export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const params = new URLSearchParams(window.location.search); if (params.get('categories') === '1') setOpen(true); }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return <CategoriesContext.Provider value={{ open, setOpen }}>{children}</CategoriesContext.Provider>;
}
export function useCategories() { return useContext(CategoriesContext); }
