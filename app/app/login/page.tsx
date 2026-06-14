import Image from 'next/image';
import { LoginForm } from './login-form';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/enamorado-logo.jpg"
            alt="Enamorado Health Services"
            width={1417}
            height={1417}
            priority
            className="h-auto w-56"
          />
          <p className="mt-2 text-sm text-slate-500">Insurance CRM — sign in to continue.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm next={searchParams.next} prefilledError={searchParams.error} />
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Access by invitation only. Contact your administrator if you need an account.
        </p>
      </div>
    </main>
  );
}
