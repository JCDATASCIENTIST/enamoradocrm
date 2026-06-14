'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CARRIERS } from '@/lib/constants';

const OTHER = '__other__';

// Carrier picker: a normal dropdown (easy to reopen and change), with an
// "Other" option that reveals a free-text field for carriers not in the list.
// Submits the chosen/typed value under `name` (default "carrier").
export function CarrierField({
  defaultValue,
  name = 'carrier',
  id = 'carrier',
}: {
  defaultValue?: string | null;
  name?: string;
  id?: string;
}) {
  const initial = defaultValue ?? '';
  const known = initial !== '' && CARRIERS.includes(initial);

  const [choice, setChoice] = useState(initial === '' ? '' : known ? initial : OTHER);
  const [custom, setCustom] = useState(known || initial === '' ? '' : initial);

  const value = choice === OTHER ? custom : choice;

  return (
    <>
      <Select id={id} value={choice} onChange={(e) => setChoice(e.target.value)}>
        <option value="">—</option>
        {CARRIERS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value={OTHER}>Other (enter manually)…</option>
      </Select>
      {choice === OTHER && (
        <Input
          className="mt-2"
          placeholder="Carrier name"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          autoFocus
        />
      )}
      <input type="hidden" name={name} value={value} />
    </>
  );
}
