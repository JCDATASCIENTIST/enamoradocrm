import { requireProfile, canWrite } from '@/lib/auth/session';
import { listPipelineContacts, listAgentsForAssignment } from '@/lib/contacts/queries';
import { todayInAppTz } from '@/lib/format';
import { PipelineBoard } from './_components/pipeline-board';
import { PipelineFilters } from './_components/pipeline-filters';
import type { ContactType } from '@/types/database.types';

interface PageProps {
  searchParams: { contact_type?: string; assigned_to?: string };
}

export default async function PipelinePage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const agents = await listAgentsForAssignment();

  const filters = {
    contact_type: (searchParams.contact_type as ContactType | 'all' | undefined) ?? 'all',
    assigned_to: searchParams.assigned_to ?? 'all',
  };

  const [cards] = await Promise.all([listPipelineContacts(filters)]);
  const agentNames = Object.fromEntries(agents.map((a) => [a.id, a.full_name ?? a.email]));

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Sales Pipeline</h1>
        <p className="mt-1 text-sm text-slate-500">
          Drag cards between columns or use the arrow buttons. Stage changes are logged automatically.
          {profile.role === 'agent' && ' You can move contacts assigned to you or unassigned.'}
        </p>
      </div>

      <div className="crm-card mb-4 p-4">
        <PipelineFilters agents={agents} />
      </div>

      <PipelineBoard
        cards={cards}
        agentNames={agentNames}
        canWrite={canWrite(profile.role)}
        userId={profile.id}
        isAdmin={profile.role === 'admin'}
        todayInAppTz={todayInAppTz()}
      />

      {cards.length >= 200 && (
        <p className="mt-4 text-xs text-amber-700">
          Showing the 200 most recently updated contacts. Use filters on Clients & Prospects for larger lists.
        </p>
      )}
    </div>
  );
}
