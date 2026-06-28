import { supabaseAdmin } from '@/lib/supabase-admin'
import ClientsView from './ClientsView'

export default async function AdminClientsPage() {
  const [{ data: projectsData, error }, { data: usersData }] = await Promise.all([
    supabaseAdmin
      .from('projects')
      .select('*, profiles(prenom, email)')
      .order('created_at', { ascending: false }),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">Erreur de chargement</p>
          <p className="text-white/30 text-xs">{error.message}</p>
        </div>
      </div>
    )
  }

  const users = (usersData?.users ?? []).map(u => ({
    id: u.id,
    email: u.email ?? '',
    prenom: (u.user_metadata?.prenom as string | undefined) ?? '',
  }))

  return <ClientsView initialProjects={projectsData ?? []} users={users} />
}
