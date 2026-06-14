import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/auth/session';
import { ImportForm } from './_components/import-form';

export default async function ImportContactsPage() {
  const profile = await requireProfile();
  if (profile.role === 'read_only') redirect('/contacts');

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-1 text-sm text-slate-500">
        <Link href="/contacts" className="hover:underline">
          Clients &amp; Prospects
        </Link>{' '}
        / Import
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Import contacts from CSV</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bulk-load clients and prospects from a spreadsheet. Each row becomes one contact.
      </p>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="font-medium text-slate-800">How it works</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <span className="font-medium">first_name</span> and{' '}
            <span className="font-medium">last_name</span> are required. Every other column is
            optional.
          </li>
          <li>
            Column names match the contacts <span className="font-medium">CSV export</span>, so you
            can export, edit in Excel/Google Sheets, and re-import.
          </li>
          <li>
            Dates accept <code>YYYY-MM-DD</code> or <code>M/D/YYYY</code>. Unrecognized dates and
            invalid plan/stage values are left blank rather than failing the row.
          </li>
          <li>
            <span className="font-medium">assigned_to_name</span> is matched to an existing user by
            name or email; no match leaves the contact unassigned.
          </li>
          <li>Rows missing a name, or containing SSN/MBI-style values, are skipped and listed back to you.</li>
        </ul>
        <div className="mt-3">
          <a href="/api/contacts/import-template.csv" className="text-brand-600 hover:underline">
            ↓ Download template CSV
          </a>
        </div>
      </div>

      <div className="mt-5">
        <ImportForm />
      </div>
    </div>
  );
}
