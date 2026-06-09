'use client';

import { useState } from 'react';
import Link from 'next/link';
import InstructorAuthSplitShell from '@/components/layouts/InstructorAuthSplitShell';
import { authService } from '@/services/authService';

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
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstructorAuthSplitShell
      leftTitle={
        <>
          Need a Fresh
          <br />
          <span className="text-yellow-300">Start?</span> <span className="text-2xl">🔐</span>
        </>
      }
      leftSubtitle="We will email reset steps so you can get back to your classes securely."
    >
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-2">Reset Password</h2>
      <p className="text-center text-xs sm:text-sm text-text-muted mb-6 sm:mb-8">
        {submitted
          ? 'Check your inbox for the next steps.'
          : 'Enter the email on your instructor account and we will help you reset it.'}
      </p>

      {submitted ? (
        <div className="space-y-4 sm:space-y-6 text-center">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <svg width="24" height="24" className="sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            If an instructor account exists for <span className="font-medium text-text-primary">{email}</span>, a reset link was generated. In development, check the API server console for the link.
          </p>
          <Link
            href="/instructor/login"
            className="inline-flex w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 transition-colors items-center justify-center gap-2 shadow-sm"
          >
            <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && <div className="p-2.5 sm:p-3 rounded-lg bg-hover text-error text-xs sm:text-sm text-center">{error}</div>}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-text-primary">Email Address</label>
            <div className="relative">
              <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                Send reset link
              </>
            )}
          </button>
        </form>
      )}

      <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-text-muted">
        Remember your password?{' '}
        <Link href="/instructor/login" className="text-primary-500 hover:text-primary-600 font-semibold">Sign in</Link>
      </p>
    </InstructorAuthSplitShell>
  );
}
