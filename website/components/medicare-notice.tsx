import type { Dictionary } from '@/lib/i18n/get-dictionary';

type MedicareNoticeProps = {
  dict: Dictionary;
  className?: string;
};

export function MedicareNotice({ dict, className = '' }: MedicareNoticeProps) {
  return (
    <div className={`rounded-2xl border-l-4 border-accent-500 border-y border-r border-y-slate-200 border-r-slate-200 bg-accent-50/40 p-6 shadow-soft ${className}`}>
      <h2 className="text-lg font-bold text-slate-900">{dict.medicareNotice.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-slate-700">{dict.medicareNotice.text}</p>
    </div>
  );
}
