import Link from 'next/link';

export default function AppNotFound() {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        That page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Go to dashboard
        </Link>
        <Link
          href="/contacts"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Browse contacts
        </Link>
      </div>
    </div>
  );
}
