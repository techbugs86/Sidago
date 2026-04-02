'use client';

import { useEffect, useState } from 'react';
import { Agent } from '@/lib/types';

const AGENT_COLORS = [
  { bar: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', avatar: 'bg-indigo-500' },
  { bar: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', avatar: 'bg-emerald-500' },
  { bar: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', avatar: 'bg-rose-500' },
  { bar: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', avatar: 'bg-amber-500' },
  { bar: 'bg-sky-500', light: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800', avatar: 'bg-sky-500' },
];

const RANK_STYLES: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-300', label: '1st' },
  2: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300', label: '2nd' },
  3: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', label: '3rd' },
};

function getMonthName(offset: number = 0): string {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function initials(agent: Agent): string {
  return `${agent.name.charAt(0)}${agent.surname.charAt(0)}`.toUpperCase();
}

function LeaderboardTable({
  title,
  agents,
  getValue,
  getWinner,
  label,
}: {
  title: string;
  agents: Agent[];
  getValue: (a: Agent) => number;
  getWinner: (a: Agent) => boolean;
  label: string;
}) {
  const sorted = [...agents].sort((a, b) => getValue(b) - getValue(a));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">{title}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
        </div>
        <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {sorted.map((agent, idx) => {
          const rank = idx + 1;
          const colorIdx = agents.indexOf(agent) % AGENT_COLORS.length;
          const color = AGENT_COLORS[colorIdx];
          const rankStyle = RANK_STYLES[rank];
          const isWinner = getWinner(agent);
          const value = getValue(agent);

          return (
            <div
              key={agent.recordId}
              className={`flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3.5 transition-colors ${rank === 1 ? 'bg-amber-50/40 dark:bg-amber-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'}`}
            >
              <div
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                  rankStyle ? `${rankStyle.bg} ${rankStyle.text}` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {rankStyle ? rankStyle.label : `${rank}th`}
              </div>

              <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ${color.avatar} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-[10px] sm:text-xs font-bold">{initials(agent)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs sm:text-sm truncate">
                  {agent.name} {agent.surname}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate">{agent.brand}</p>
              </div>

              {isWinner && (
                <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] sm:text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-700 whitespace-nowrap">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Winner
                </span>
              )}

              <div className={`px-2 sm:px-3 py-1 rounded-lg ${color.light} ${color.text} text-xs sm:text-sm font-bold min-w-[40px] sm:min-w-[52px] text-center border ${color.border}`}>
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChart({
  agents,
  getValue,
  title,
  subtitle,
}: {
  agents: Agent[];
  getValue: (a: Agent) => number;
  title: string;
  subtitle: string;
}) {
  const BAR_MAX_PX = 160;
  const sorted = [...agents].sort((a, b) => getValue(b) - getValue(a));
  const max = Math.max(...sorted.map(getValue), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{title}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {/* fixed-height bar area + labels below */}
      <div className="flex items-end gap-3" style={{ height: `${BAR_MAX_PX + 40}px` }}>
        {sorted.map((agent) => {
          const origIdx = agents.indexOf(agent) % AGENT_COLORS.length;
          const color = AGENT_COLORS[origIdx];
          const val = getValue(agent);
          const barPx = val > 0 ? Math.max(Math.round((val / max) * BAR_MAX_PX), 6) : 0;

          return (
            <div key={agent.recordId} className="flex-1 flex flex-col items-center gap-1" style={{ height: `${BAR_MAX_PX + 40}px` }}>
              {/* spacer pushes bar down so all bars align at the bottom */}
              <div className="flex-1" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-none">{val}</span>
              <div
                className={`w-full ${color.bar} rounded-t-lg transition-all duration-700 ease-out`}
                style={{ height: `${barPx}px`, flexShrink: 0 }}
              />
              <span
                className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight w-full truncate mt-1"
                style={{ flexShrink: 0, height: '20px' }}
                title={`${agent.name} ${agent.surname}`}
              >
                {agent.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarizStatCard({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className={`rounded-2xl border p-3 sm:p-4 flex items-center gap-2 sm:gap-3 ${colorClass}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/60 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-medium opacity-70 truncate">{label}</p>
        <p className="text-base sm:text-xl font-bold truncate">{value}</p>
      </div>
    </div>
  );
}

function getAgentNameFromCookie(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/agent_name=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export default function LeaderboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInName, setLoggedInName] = useState('');

  useEffect(() => {
    setLoggedInName(getAgentNameFromCookie());
  }, []);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setAgents(d.agents ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Current agent's personal stats (based on logged-in user)
  const firstName = loggedInName.split(' ')[0].toLowerCase();
  const mariz = agents.find((a) => a.name.toLowerCase() === firstName);
  const monthlyWinner = agents.find((a) => a.monthly_winner);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold mb-1">Failed to load agents</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50/60 dark:bg-gray-950">

      {/* Page header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-none">Leaderboard</h1>
              {mariz && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">
                  {mariz.name} {mariz.surname}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
            {new Date().toLocaleDateString('default', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">

        {/* Mariz's personal stats */}
        {mariz ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              My Stats — {mariz.name} {mariz.surname}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MarizStatCard
                label="Hot Leads Today"
                value={mariz.hot_leads_today}
                colorClass="bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                icon={
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                }
              />
              <MarizStatCard
                label="Calls Today"
                value={mariz.today_calls_made}
                colorClass="bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200"
                icon={
                  <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <MarizStatCard
                label={`Points — ${getMonthName(0)}`}
                value={mariz.monthly_points}
                colorClass="bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200"
                icon={
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                }
              />
              <MarizStatCard
                label="Monthly Leader"
                value={monthlyWinner ? `${monthlyWinner.name} ${monthlyWinner.surname}` : '—'}
                colorClass="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                icon={
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
              />
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4">
            <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
              Agent &quot;{loggedInName || 'Unknown'}&quot; not found in this table. Showing all agents below.
            </p>
          </div>
        )}

        {/* Leaderboard tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 overflow-x-auto">
          <LeaderboardTable
            title={`This Month — ${getMonthName(0)}`}
            agents={agents}
            getValue={(a) => a.monthly_points}
            getWinner={(a) => a.monthly_winner}
            label="Ranked by monthly points"
          />
          <LeaderboardTable
            title={`Last Month — ${getMonthName(-1)}`}
            agents={agents}
            getValue={(a) => a.last_month_points}
            getWinner={(a) => a.last_month_winner}
            label="Ranked by last month points"
          />
        </div>

        {/* Charts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Performance Charts</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            <BarChart
              agents={agents}
              getValue={(a) => a.monthly_calls}
              title="Calls This Month"
              subtitle={getMonthName(0)}
            />
            <BarChart
              agents={agents}
              getValue={(a) => a.last_month_calls}
              title="Calls Last Month"
              subtitle={getMonthName(-1)}
            />
            <BarChart
              agents={agents}
              getValue={(a) => a.count_wins}
              title="All-Time Wins"
              subtitle="Total career wins"
            />
          </div>
        </div>

        {/* Agent detail cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Agent Details</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {agents.map((agent, idx) => {
              const color = AGENT_COLORS[idx % AGENT_COLORS.length];
              return (
                <div key={agent.recordId} className={`bg-white dark:bg-gray-800 rounded-2xl border ${color.border} shadow-sm overflow-hidden`}>
                  <div className={`h-1 ${color.bar}`} />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${color.avatar} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-sm font-bold">{initials(agent)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{agent.name} {agent.surname}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{agent.brand}</p>
                      </div>
                      {agent.monthly_winner && (
                        <span className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Winner
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {[
                        { label: 'Pts/Mo', value: agent.monthly_points },
                        { label: 'Calls/Mo', value: agent.monthly_calls },
                        { label: 'Hot/Mo', value: agent.monthly_hot_leads },
                        { label: 'Closed/Mo', value: agent.monthly_contract_closed },
                        { label: 'Wins', value: agent.count_wins },
                        { label: 'All Pts', value: agent.all_points },
                      ].map(({ label, value }) => (
                        <div key={label} className={`rounded-lg ${color.light} px-1.5 sm:px-2 py-1 sm:py-1.5 text-center`}>
                          <p className={`text-[10px] sm:text-xs ${color.text} font-medium`}>{label}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-4" />
      </main>
    </div>
  );
}
