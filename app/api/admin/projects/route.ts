import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*, profiles(prenom, email)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { client_id, nom, offre } = await request.json()

  // Récupère le user auth pour obtenir email + métadonnées
  const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(client_id)

  if (userError || !user) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 })
  }

  // Crée le profil à la volée si inexistant
  await supabaseAdmin.from('profiles').upsert({
    id: user.id,
    email: user.email,
    prenom: (user.user_metadata?.prenom as string | undefined) ?? '',
  })

  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({ client_id: user.id, nom, offre, statut: 'En attente' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
