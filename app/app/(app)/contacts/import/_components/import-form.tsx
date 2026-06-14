'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';
import { importContacts, type ImportState } from '@/lib/contacts/import';
import { Button } from '@/components/ui/button';

const initial: ImportState = {};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? 'Importing…' : 'Import contacts'}
    </Button>
  );
}

export function ImportForm() {
  const [state, formAction] = useFormState(importContacts, initial);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Path B reminder: do not import SSNs, full Medicare/Medicaid IDs, or any health diagnoses.
          Rows containing those patterns are rejected automatically.
        </div>

        <div>
          <label htmlFor="file" className="mb-1 block text-sm font-medium text-slate-700">
            CSV file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".csv,text/csv"
            required
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
          />
          {fileName && <div className="mt-1 text-xs text-slate-500">Selected: {fileName}</div>}
        </div>

        {state.error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
        )}

        <div className="flex items-center gap-3">
          <SubmitButton disabled={false} />
          <Link href="/contacts" className="text-sm text-slate-500 hover:underline">
            Back to contacts
          </Link>
        </div>
      </form>

      {state.result && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Import summary</h2>
          <div className="mt-3 flex flex-wrap gap-6 text-sm">
            <div>
              <div className="text-2xl font-semibold text-green-700">{state.result.inserted}</div>
              <div className="text-slate-500">Imported</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-400">{state.result.skipped}</div>
              <div className="text-slate-500">Skipped</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">{state.result.total}</div>
              <div className="text-slate-500">Rows in file</div>
            </div>
          </div>

          {state.result.errors.length > 0 ? (
            <div className="mt-4">
              <div className="mb-1 text-sm font-medium text-slate-700">
                Skipped rows ({state.result.errors.length})
              </div>
              <div className="max-h-64 overflow-y-auto rounded-md border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 w-20">Row</th>
                      <th className="px-3 py-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {state.result.errors.map((e) => (
                      <tr key={e.row}>
                        <td className="px-3 py-2 text-slate-600">{e.row}</td>
                        <td className="px-3 py-2 text-slate-700">{e.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Fix these rows in your spreadsheet and re-import just those — already-imported rows
                are not affected.
              </p>
            </div>
          ) : (
            state.result.inserted > 0 && (
              <p className="mt-4 text-sm text-green-700">
                All rows imported successfully.{' '}
                <Link href="/contacts" className="underline">
                  View contacts →
                </Link>
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
