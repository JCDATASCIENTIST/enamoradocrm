import Link from 'next/link';

export function Pager({
  page,
  total,
  pageSize,
  buildHref,
}: {
  page: number;
  total: number;
  pageSize: number;
  buildHref: (page: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex justify-between text-sm text-slate-500">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className="text-brand-600 hover:underline">
          ← Previous
        </Link>
      ) : (
        <span className="opacity-40">← Previous</span>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className="text-brand-600 hover:underline">
          Next →
        </Link>
      ) : (
        <span className="opacity-40">Next →</span>
      )}
    </div>
  );
}
