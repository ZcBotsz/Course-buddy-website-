'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Play,
  Settings,
  CheckCircle2,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: Plus },
  { href: '/admin/categories', label: 'Categories', icon: CheckCircle2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="relative z-20 flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 transition-all duration-300">
      <div className="flex items-center gap-3 h-14 px-6 border-b border-slate-200 bg-slate-50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
          <span className="text-white font-bold text-xs tracking-wider">CB</span>
        </div>
        <span className={collapsed ? 'hidden' : 'font-heading font-bold text-slate-900 tracking-tight text-lg'}>
          Course Buddy
        </span>
      </div>

      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="ml-4 rounded-lg bg-slate-100 p-2 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : null}

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10 border border-emerald-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {collapsed ? (
                <span className="sr-only">{item.label}</span>
              ) : (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-200">
        <a
          href="/admin/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={collapsed ? 'hidden' : 'whitespace-nowrap'}>Sign out</span>
        </a>
      </div>

      {!collapsed && (
        <button
          onClick={() => setCollapsed(true)}
          className="absolute bottom-4 left-4 w-8 h-8 rounded-lg bg-white/90 backdrop-blur border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors z-10"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
}
