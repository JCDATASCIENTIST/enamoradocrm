'use client';

// Error boundary for any page under (app). Triggered by thrown errors in
// server components or server actions. Logs to the browser console so admins
// can grab the digest from the server logs.

import Link from 'next/link';
import { useEffect } from 'react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page failed to load. The error has been logged. You can try again, or head back to the dashboard.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-slate-400">Error ID: {error.digest}</p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
