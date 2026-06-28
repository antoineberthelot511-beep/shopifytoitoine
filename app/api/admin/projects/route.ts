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
  const { client_email, nom, offre } = await request.json()

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', client_email)
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      { error: 'Client introuvable. Il doit d\'abord créer un compte.' },
      { status: 404 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({ client_id: profile.id, nom, offre, statut: 'En attente' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
