'use client';

import { useEffect, useState, useCallback } from 'react';
import { Lead } from '@/lib/types';
import Modal from '@/components/Modal';


const LEAD_TYPE_OPTIONS = ['General', 'Warm', 'Hot', 'Cold', 'Referral'];
const CONTACT_TYPE_OPTIONS = [
  'Prospecting',
  'Interested',
  'Not Interested',
  'No Answer',
  'Left Message',
  'Call Lead Back',
  'Bad Number',
  'DNC',
];

function contactTypeBadge(type: string): string {
  const map: Record<string, string> = {
    Prospecting:      'bg-amber-100 text-amber-700 ring-1 ring-amber-300',
    Interested:       'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300',
    'Not Interested': 'bg-slate-100 text-slate-600 ring-1 ring-slate-300',
    'No Answer':      'bg-slate-100 text-slate-600 ring-1 ring-slate-300',
    'Left Message':   'bg-blue-100 text-blue-700 ring-1 ring-blue-300',
    'Call Lead Back': 'bg-purple-100 text-purple-700 ring-1 ring-purple-300',
    'Bad Number':     'bg-orange-100 text-orange-700 ring-1 ring-orange-300',
    DNC:              'bg-red-100 text-red-700 ring-1 ring-red-300',
  };
  return map[type] ?? 'bg-slate-100 text-slate-600 ring-1 ring-slate-300';
}

export default function CallsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoCalling, setIsAutoCalling] = useState(false);

  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [callBackDate, setCallBackDate] = useState('');
  const [leadType, setLeadType] = useState('');
  const [contactType, setContactType] = useState('');
  const [notWorkAnymore, setNotWorkAnymore] = useState(false);

  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);

  const currentLead = leads[currentIndex] ?? null;

  const syncLeadToForm = useCallback((lead: Lead) => {
    setEmail(lead.email);
    setNotes(lead.call_notes_sidago);
    setCallBackDate(lead.next_follow_up_date_sidago);
    setLeadType(lead.lead_type);
    setContactType(lead.contact_type);
    setNotWorkAnymore(lead.not_work_anymore);
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Unknown error');
        setLeads(data.leads);
        if (data.leads.length > 0) syncLeadToForm(data.leads[0]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [syncLeadToForm]);

  useEffect(() => {
    if (currentLead) syncLeadToForm(currentLead);
  }, [currentIndex, currentLead, syncLeadToForm]);

  const showModal = (title: string, message: string) => setModal({ title, message });

  const handleSkip = () => {
    if (currentIndex < leads.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      showModal('End of List', 'You have reached the last lead in the list.');
    }
  };

  const handleSave = () => {
    showModal('Saved (POC)', `Changes for "${currentLead?.full_name}" have been noted locally. No data was sent to Airtable.`);
  };

  const handleActionButton = (action: string) => {
    const messages: Record<string, string> = {
      'No Answer':      `Logged "No Answer" for ${currentLead?.full_name}. No changes made to Airtable.`,
      Interested:       `Logged "Interested" for ${currentLead?.full_name}. No changes made to Airtable.`,
      'Bad Number':     `Logged "Bad Number" for ${currentLead?.full_name}. No changes made to Airtable.`,
      'Not Interested': `Logged "Not Interested" for ${currentLead?.full_name}. No changes made to Airtable.`,
      'Left Message':   `Logged "Left Message" for ${currentLead?.full_name}. No changes made to Airtable.`,
      'Call Lead Back': `Logged "Call Lead Back" for ${currentLead?.full_name}. No changes made to Airtable.`,
      DNC:              `Logged "Do Not Call" for ${currentLead?.full_name}. No changes made to Airtable.`,
    };
    showModal(action, messages[action] ?? `Action "${action}" logged.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading leads from Airtable...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold mb-1">Failed to load leads</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{error}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-3">Check your AIRTABLE_API_TOKEN in .env.local</p>
        </div>
      </div>
    );
  }

  if (!currentLead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-slate-500 dark:text-slate-400">No leads found in this view.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-gray-950">

      {/* Top Nav */}
      <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-7 h-7 bg-sky-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-800 dark:text-gray-100 text-sm hidden sm:block">Call UI</span>
            </div>

            <div className="h-5 w-px bg-slate-200 dark:bg-gray-700" />

            <div className="flex items-center gap-2 min-w-0">
              <label className="text-xs text-slate-400 dark:text-gray-500 font-medium whitespace-nowrap">Lead</label>
              <select
                value={currentIndex}
                onChange={(e) => setCurrentIndex(Number(e.target.value))}
                className="bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 max-w-[220px] truncate cursor-pointer transition"
              >
                {leads.map((lead, i) => (
                  <option key={lead.recordId} value={i}>
                    {lead.lead_id || lead.full_name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400 dark:text-gray-500 whitespace-nowrap font-medium">
                {currentIndex + 1} / {leads.length}
              </span>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg border border-slate-300 dark:border-gray-600 transition-colors whitespace-nowrap"
          >
            Skip
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Auto Calling Banner */}
      <div className={`sticky top-14 z-30 transition-all duration-300 ${
        isAutoCalling
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40'
          : 'bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700'
      }`}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isAutoCalling && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
            )}
            <span className={`text-sm font-semibold ${isAutoCalling ? 'text-white' : 'text-slate-600 dark:text-gray-300'}`}>
              {isAutoCalling ? 'Auto Calling in progress...' : 'Auto Calling'}
            </span>
            {isAutoCalling && currentLead && (
              <span className="text-emerald-100 text-xs font-medium hidden sm:block">
                Calling: {currentLead.full_name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoCalling(true)}
              disabled={isAutoCalling}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                isAutoCalling
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Auto Calling
            </button>
            <button
              onClick={() => setIsAutoCalling(false)}
              disabled={!isAutoCalling}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                !isAutoCalling
                  ? 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-600 cursor-not-allowed border border-slate-200 dark:border-gray-700'
                  : 'bg-white text-red-600 hover:bg-red-50 active:scale-95 shadow-md'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Auto Calling
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* Hero Lead Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
          <div className={`h-1.5 ${isAutoCalling ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-sky-500 to-indigo-500'}`} />
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100 leading-tight">{currentLead.lead_id}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${contactTypeBadge(currentLead.contact_type)}`}>
                  {currentLead.contact_type}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800">
                  {currentLead.timezone}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl px-4 py-2 border border-slate-200 dark:border-gray-600">
                <p className="text-xs text-slate-400 dark:text-gray-500 font-medium mb-0.5">Company</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">{currentLead.company_name}</p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl px-4 py-2 border border-slate-200 dark:border-gray-600">
                <p className="text-xs text-slate-400 dark:text-gray-500 font-medium mb-0.5">Role</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">{currentLead.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Contact Info */}
          <div className="lg:col-span-1 space-y-4">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Phone</p>
              <a
                href={`tel:${currentLead.phone}`}
                className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-500 font-bold text-lg transition-colors group"
              >
                <span className="w-8 h-8 bg-sky-100 dark:bg-sky-900/40 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/60 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                {currentLead.phone}
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5 space-y-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Identity</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mb-0.5">Full Name</p>
                  <p className="font-semibold text-slate-800 dark:text-gray-100">{currentLead.full_name}</p>
                </div>
                <div className="border-t border-slate-100 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mb-1">Lead Type</p>
                  <select
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  >
                    {LEAD_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    {!LEAD_TYPE_OPTIONS.includes(leadType) && leadType && (
                      <option value={leadType}>{leadType}</option>
                    )}
                  </select>
                </div>
                <div className="border-t border-slate-100 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mb-1">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="No email on record"
                    className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-400 dark:placeholder:text-gray-500 transition"
                  />
                </div>
                <div className="border-t border-slate-100 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mb-1">Contact Type</p>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  >
                    {CONTACT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    {!CONTACT_TYPE_OPTIONS.includes(contactType) && contactType && (
                      <option value={contactType}>{contactType}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-700">
                <span className="text-xs text-slate-500 dark:text-gray-400 leading-tight max-w-[160px]">Doesn&apos;t work here anymore</span>
                <button
                  role="switch"
                  aria-checked={notWorkAnymore}
                  onClick={() => setNotWorkAnymore((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                    notWorkAnymore ? 'bg-amber-500' : 'bg-slate-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                    notWorkAnymore ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Dates</p>
              <div>
                <p className="text-xs text-slate-400 dark:text-gray-500 mb-1">Call Back Date</p>
                <input
                  type="date"
                  value={callBackDate}
                  onChange={(e) => setCallBackDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
              </div>
              <div className="border-t border-slate-100 dark:border-gray-700 pt-2">
                <p className="text-xs text-slate-400 dark:text-gray-500 mb-0.5">Last Called</p>
                <p className="text-sm font-medium text-slate-700 dark:text-gray-300">{currentLead.last_called_date_sidago || '—'}</p>
              </div>
              <div className="border-t border-slate-100 dark:border-gray-700 pt-2">
                <p className="text-xs text-slate-400 dark:text-gray-500 mb-0.5">Last Fixed Date</p>
                <p className="text-sm font-medium text-slate-700 dark:text-gray-300">{currentLead.last_fixed_date || '—'}</p>
              </div>
            </div>
          </div>

          {/* Right: Notes + Actions + History */}
          <div className="lg:col-span-2 space-y-4">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Call Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Add notes from this call..."
                className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-400 dark:placeholder:text-gray-500 resize-none transition"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-sky-200 dark:shadow-sky-900/40 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4">Call Outcome</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button onClick={() => handleActionButton('No Answer')}
                  className="py-3 px-2 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 active:scale-95 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition-all">
                  No Answer
                </button>
                <button onClick={() => handleActionButton('Interested')}
                  className="py-3 px-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40 transition-all">
                  Interested
                </button>
                <button onClick={() => handleActionButton('Bad Number')}
                  className="py-3 px-2 bg-blue-500 hover:bg-blue-400 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 dark:shadow-blue-900/40 transition-all">
                  Bad Number
                </button>
                <button onClick={() => handleActionButton('Not Interested')}
                  className="py-3 px-2 bg-slate-600 hover:bg-slate-500 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all">
                  Not Interested
                </button>
                <button onClick={() => handleActionButton('Left Message')}
                  className="py-3 px-2 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 active:scale-95 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition-all">
                  Left Message
                </button>
                <button onClick={() => handleActionButton('Call Lead Back')}
                  className="py-3 px-2 bg-rose-500 hover:bg-rose-400 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm shadow-rose-200 dark:shadow-rose-900/40 transition-all">
                  Call Lead Back
                </button>
                <div />
                <button onClick={() => handleActionButton('DNC')}
                  className="py-3 px-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all">
                  DNC
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
                <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Notes History</p>
                <p className="text-slate-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {currentLead.history_call_notes_sidago || '—'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5">
                <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Calls History</p>
                <p className="text-slate-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {currentLead.history_calls_sidago || '—'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-5 sm:col-span-2">
                <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-3">Other Contacts</p>
                <p className="text-slate-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {currentLead.other_contacts || '—'}
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="h-4" />
      </main>

      {modal && (
        <Modal title={modal.title} message={modal.message} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
