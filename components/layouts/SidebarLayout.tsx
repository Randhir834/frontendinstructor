'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  items: SidebarItem[];
  title?: string;
  searchPlaceholder?: string;
  searchPath?: string;
}

function SidebarLayoutContent({ children, items, title = 'PlayFit LMS', searchPlaceholder = 'Search courses...', searchPath = '/instructor/courses' }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${searchPath}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-dark-900/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile drawer, desktop fixed */}
      <aside
        className={cn(
          'bg-sidebar border-r border-border flex flex-col z-50',
          'fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:static md:flex',
          collapsed ? 'md:w-16 w-64' : 'md:w-64 w-64'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {(!collapsed || !mobileOpen) && (
            <div className="flex items-center gap-2 flex-1">
              <img
                src="/images/playfit-logo.jpg"
                alt="PlayFit"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1.5 rounded-md hover:bg-hover text-text-muted"
            >
              {collapsed ? '→' : '←'}
            </button>
            {/* Mobile close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-md hover:bg-hover text-text-muted"
            >
              ✕
            </button>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-hover hover:text-primary-500 transition-colors"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              {(!collapsed || !mobileOpen) && (
                <span className={cn('text-sm font-medium', collapsed && 'hidden md:block')}>{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header with Search */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 bg-card border-b border-border">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-4xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>
          <div className="w-10" />
        </header>

        {/* Mobile header with hamburger */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-hover text-text-muted"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <form onSubmit={handleSearch} className="flex-1 mx-3 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-muted size-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </form>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function SidebarLayout(props: SidebarLayoutProps) {
  return (
    <Suspense fallback={<div className="flex-1 bg-background" />}>
      <SidebarLayoutContent {...props} />
    </Suspense>
  );
}
