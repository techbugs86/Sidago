'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDarkMode } from '@/components/DarkModeContext';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/calls',
    label: 'Calls',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
];

// Pages that should NOT show the sidebar
const NO_SIDEBAR_ROUTES = ['/landing'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const { dark, toggleDark } = useDarkMode();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(/agent_name=([^;]+)/);
    if (match) setAgentName(decodeURIComponent(match[1]));
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'agent_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.replace('/landing');
  };

  const hideSidebar = NO_SIDEBAR_ROUTES.includes(pathname);

  if (hideSidebar) {
    return (
      <div className={dark ? 'dark' : ''}>
        {children}
      </div>
    );
  }

  const sidebarContent = (
    <>
      {/* Logo / Toggle */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-100 dark:border-gray-700/80">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate md:hidden">Sidago CRM</span>
          {open && <span className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate hidden md:inline">Sidago CRM</span>}
        </div>
        {/* Desktop toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-8 h-8 rounded-lg items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0 hidden md:flex"
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        >
          {open ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title={!open ? item.label : undefined}
            >
              <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}>
                {item.icon}
              </span>
              {/* Always show label on mobile, conditionally on desktop */}
              <span className="truncate md:hidden">{item.label}</span>
              {open && <span className="truncate hidden md:inline">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Dark mode toggle + footer */}
      <div className="px-2 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-700/80 pt-3">
        <button
          onClick={toggleDark}
          className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-colors group text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100`}
          title={!open ? (dark ? 'Switch to Light Mode' : 'Switch to Dark Mode') : undefined}
        >
          {dark ? (
            <svg className="w-5 h-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span className="truncate md:hidden">{dark ? 'Light Mode' : 'Dark Mode'}</span>
          {open && <span className="truncate hidden md:inline">{dark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Agent info + logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 group"
          title={!open ? `Log out (${agentName})` : undefined}
        >
          <svg className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {/* Always show on mobile */}
          <div className="flex flex-col items-start min-w-0 md:hidden">
            <span className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">Log out</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate w-full">{agentName}</span>
          </div>
          {open && (
            <div className="flex-col items-start min-w-0 hidden md:flex">
              <span className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">Log out</span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate w-full">{agentName}</span>
            </div>
          )}
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-600 px-2 md:hidden">Sidago CRM v1.0</p>
        {open && <p className="text-xs text-gray-400 dark:text-gray-600 px-2 hidden md:block">Sidago CRM v1.0</p>}
      </div>
    </>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'dark' : ''}`}>
      <div className="flex h-full w-full overflow-hidden bg-white dark:bg-gray-950">

        {/* Mobile top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">Sidago CRM</span>
          </div>
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Desktop sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ease-in-out flex-shrink-0 ${
            open ? 'w-56' : 'w-16'
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-w-0 pt-14 md:pt-0">
          {children}
        </main>

      </div>
    </div>
  );
}