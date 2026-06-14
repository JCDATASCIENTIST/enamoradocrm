'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, type LoginState } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? 'Signing in…' : 'Sign in'}
    </Button>
  );
}

export function LoginForm({ next, prefilledError }: { next?: string; prefilledError?: string }) {
  const [state, formAction] = useFormState(login, initialState);

  const errorMessage =
    state.error ??
    (prefilledError === 'account_disabled'
      ? 'Your account has been disabled. Contact an administrator.'
      : undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? '/dashboard'} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-base font-medium text-slate-700">
          Email
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-base font-medium text-slate-700">
          Password
        </label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {errorMessage && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
      )}
      <SubmitButton />
    </form>
  );
}
