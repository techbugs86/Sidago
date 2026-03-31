'use client';

import { useEffect } from 'react';

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function Modal({ title, message, onClose }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">{title}</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
