import { requireAdmin } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Pager } from '@/components/ui/pager';
import { InviteUserForm } from './_components/invite-form';
import { UserRowActions } from './_components/user-row-actions';

const PAGE_SIZE = 25;

interface PageProps {
  searchParams: { page?: string };
}

export default async function UsersAdminPage({ searchParams }: PageProps) {
  await requireAdmin();
  const page = searchParams.page ? Math.max(1, Number(searchParams.page)) : 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = createClient();
  const { data: profiles, count: total } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, is_active, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
      <p className="mt-1 text-sm text-slate-500">Invite new users and manage roles. Admin-only.</p>

      <div className="mt-6">
        <InviteUserForm />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(profiles ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 text-slate-900">{p.full_name ?? '—'}</td>
                <td className="px-4 py-2 text-slate-600">{p.email}</td>
                <td className="px-4 py-2 text-slate-600">{p.role}</td>
                <td className="px-4 py-2 text-slate-600">{p.is_active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  <UserRowActions userId={p.id} role={p.role} is_active={p.is_active} />
                </td>
              </tr>
            ))}
            {(!profiles || profiles.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pager
        page={page}
        total={total ?? 0}
        pageSize={PAGE_SIZE}
        buildHref={(p) => `/admin/users?page=${p}`}
      />
    </div>
  );
}
