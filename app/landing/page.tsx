'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CREDENTIALS = [
  { email: 'mariz@gmail.com', password: '123', name: 'Mariz Cabido' },
  { email: 'bryan@gmail.com', password: '123', name: 'Bryan Taylor' },
  { email: 'chris@gmail.com', password: '123', name: 'Chris Moore' },
  { email: 'tom@gmail.com', password: '123', name: 'Tom Silver' },
];

export default function LandingPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (document.cookie.includes('auth=true')) {
      setBlocked(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const match = CREDENTIALS.find(
        (c) => c.email === email.trim().toLowerCase() && c.password === password
      );
      if (match) {
        document.cookie = 'auth=true; path=/';
        document.cookie = `agent_name=${encodeURIComponent(match.name)}; path=/`;
        router.replace('/dashboard');
      } else {
        setError('Invalid credentials. Please check your email and password.');
        setLoading(false);
      }
    }, 600);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setError('Sign up is not available yet. Please use your assigned credentials.');
      setLoading(false);
    }, 600);
  };

  const switchMode = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setIsLogin(!isLogin);
  };

  if (blocked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-6a3 3 0 11-6 0 3 3 0 016 0zm7 3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">You are already logged in</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">Press <strong>Logout</strong> from the sidebar to go back.</p>
          <button
            onClick={() => router.replace('/dashboard')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Sidago CRM</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
            {isLogin ? 'Sign in to your portal' : 'Create your account'}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-5 sm:p-8">
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4 sm:space-y-5">

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-800 dark:text-gray-100 text-sm rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-gray-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-800 dark:text-gray-100 text-sm rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-gray-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-800 dark:text-gray-100 text-sm rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-gray-500 transition"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>
        </div>

        {/* Switch login / signup */}
        <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-5">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={switchMode} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={switchMode} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}
