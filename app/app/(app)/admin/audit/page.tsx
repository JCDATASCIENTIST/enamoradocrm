import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { listAuditLog } from '@/lib/admin/queries';

interface PageProps {
  searchParams: {
    table_name?: string;
    action?: string;
    from?: string;
    to?: string;
    page?: string;
  };
}

const TABLES = ['contacts', 'profiles', 'follow_ups', 'commissions', 'enrollment_activities'];

/** Render a value safely — strings get quoted, everything else stringified. */
function renderValue(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'string') return `"${v.length > 40 ? v.slice(0, 40) + '…' : v}"`;
  return JSON.stringify(v);
}

/** Truncate JSONB diffs for compact display; full data is in the database. */
function changedFieldsSummary(changed: Record<string, unknown> | null): { key: string; value: unknown }[] {
  if (!changed) return [];
  return Object.entries(changed)
    .filter(([k]) => !['updated_at', 'updated_by'].includes(k))
    .map(([key, value]) => ({ key, value }))
    .slice(0, 6);
}

export default async function AuditLogPage({ searchParams }: PageProps) {
  await requireAdmin();

  const page = searchParams.page ? Math.max(1, Number(searchParams.page)) : 1;
  const { rows, total, pageSize } = await listAuditLog(
    {
      table_name: searchParams.table_name,
      action: searchParams.action as 'insert' | 'update' | 'delete' | undefined,
      from: searchParams.from,
      to: searchParams.to,
    },
    page,
  );
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function qs(extra: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { ...searchParams, ...extra };
    for (const [k, v] of Object.entries(merged)) {
      if (v) p.set(k, v);
    }
    return p.toString();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-slate-900">Audit log</h1>
      <p className="mt-1 text-sm text-slate-500">
        Append-only record of changes to sensitive tables. {total} entries.
      </p>

      <form
        method="get"
        action="/admin/audit"
        className="mt-5 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Table</span>
          <select
            name="table_name"
            defaultValue={searchParams.table_name ?? ''}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {TABLES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Action</span>
          <select
            name="action"
            defaultValue={searchParams.action ?? ''}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">All</option>
            <option value="insert">insert</option>
            <option value="update">update</option>
            <option value="delete">delete</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">From</span>
          <input
            type="date"
            name="from"
            defaultValue={searchParams.from ?? ''}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">To</span>
          <input
            type="date"
            name="to"
            defaultValue={searchParams.to ?? ''}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
        >
          Filter
        </button>
        <Link href="/admin/audit" className="text-sm text-slate-500 hover:underline">
          Clear
        </Link>
      </form>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Actor</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Table / Record</th>
              <th className="px-3 py-2">Changed fields</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const changes = changedFieldsSummary(row.changed_fields as Record<string, unknown> | null);
              return (
                <tr key={row.id} className="align-top hover:bg-slate-50">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                    {new Date(row.occurred_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.actor_email ?? row.actor_id ?? '—'}</td>
                  <td className="px-3 py-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{row.action}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-slate-600">{row.table_name}</div>
                    {row.table_name === 'contacts' ? (
                      <Link
                        href={`/contacts/${row.row_id}`}
                        className="font-mono text-xs text-brand-600 hover:underline"
                      >
                        {row.row_id.slice(0, 8)}…
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-slate-500">{row.row_id.slice(0, 8)}…</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-700">
                    {row.action === 'update' && changes.length > 0 ? (
                      <ul className="space-y-0.5">
                        {changes.map(({ key, value }) => (
                          <li key={key}>
                            <span className="font-medium text-slate-800">{key}</span>: {renderValue(value)}
                          </li>
                        ))}
                        {Object.keys(row.changed_fields ?? {}).filter(
                          (k) => !['updated_at', 'updated_by'].includes(k),
                        ).length > 6 && (
                          <li className="text-slate-400">…more</li>
                        )}
                      </ul>
                    ) : row.action === 'insert' ? (
                      <span className="text-slate-500">row created</span>
                    ) : row.action === 'delete' ? (
                      <span className="text-red-600">row deleted</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No audit entries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between text-sm text-slate-500">
          {page > 1 ? (
            <Link href={`/admin/audit?${qs({ page: String(page - 1) })}`} className="text-brand-600 hover:underline">
              ← Previous
            </Link>
          ) : (
            <span className="opacity-40">← Previous</span>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/admin/audit?${qs({ page: String(page + 1) })}`} className="text-brand-600 hover:underline">
              Next →
            </Link>
          ) : (
            <span className="opacity-40">Next →</span>
          )}
        </div>
      )}
    </div>
  );
}
