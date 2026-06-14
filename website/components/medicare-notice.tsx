import type { Dictionary } from '@/lib/i18n/get-dictionary';

type MedicareNoticeProps = {
  dict: Dictionary;
  className?: string;
};

export function MedicareNotice({ dict, className = '' }: MedicareNoticeProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-soft ${className}`}>
      <h2 className="text-lg font-semibold text-slate-900">{dict.medicareNotice.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{dict.medicareNotice.text}</p>
    </div>
  );
}
