'use client';

import { useState } from 'react';
import Link from 'next/link';
import InstructorAuthSplitShell from '@/components/layouts/InstructorAuthSplitShell';
import { authService } from '@/services/authService';
import { getUserFriendlyError, logTechnicalError } from '@/utils/errorHandler';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword({
        email,
        expectedRole: 'instructor',
        clientOrigin: typeof window !== 'undefined' ? window.location.origin : '',
      });
      setSubmitted(true);
    } catch (err: unknown) {
      logTechnicalError('Instructor Forgot Password', err);
      const message = getUserFriendlyError(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstructorAuthSplitShell
      leftTitle={
        <>
          <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Need a Fresh
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
            Start?
          </span>{' '}
          <span className="text-3xl animate-float">🔐</span>
        </>
      }
      leftSubtitle="We will send reset steps to your email so you can get back to teaching safely."
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600">
          {submitted
            ? 'Check your inbox for the reset link.'
            : 'Enter your email address and we will send you a password reset link.'}
        </p>
      </div>

          {submitted ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg animate-in zoom-in">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="space-y-3 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  If an instructor account exists for <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{email}</span>, we've sent a password reset link to your email.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The link will <span className="font-bold text-orange-600">expire in 10 minutes</span>. Please check your inbox and spam folder.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-semibold text-sm hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-600 active:from-cyan-700 active:via-blue-700 active:to-cyan-700 transition-all items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="relative">
                  <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500 absolute top-0 left-0 right-0 rounded-t-xl"></div>
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center pt-5">
                    {error}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white shadow-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-semibold text-sm hover:from-cyan-600 hover:via-blue-600 hover:to-cyan-600 active:from-cyan-700 active:via-blue-700 active:to-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Send reset link
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent hover:from-cyan-700 hover:to-blue-700">
              Sign in
            </Link>
          </p>
    </InstructorAuthSplitShell>
  );
}
