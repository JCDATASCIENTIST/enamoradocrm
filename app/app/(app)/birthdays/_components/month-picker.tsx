'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function MonthPicker({ currentMonth }: { currentMonth: number }) {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <select
      value={currentMonth}
      onChange={(e) => {
        const next = new URLSearchParams(params.toString());
        next.set('mode', 'month');
        next.set('month', e.target.value);
        router.push(`/birthdays?${next.toString()}`);
      }}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      aria-label="Pick month"
    >
      {MONTHS.map((label, i) => (
        <option key={i} value={i + 1}>
          {label}
        </option>
      ))}
    </select>
  );
}
