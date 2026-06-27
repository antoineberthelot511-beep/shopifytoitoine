import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

export type Lead = {
  id: string
  prenom: string
  email: string
  niche: string
  offre: string
  message: string
  created_at: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'antoineberthelot511@gmail.com'
const FROM = 'Sigma Shop <onboarding@resend.dev>'

function adminEmailHtml(prenom: string, email: string, offre: string, niche: string, message: string) {
  const date = new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' })
  const time = new Date().toLocaleTimeString('fr-FR', { timeStyle: 'short' })

  const card = (label: string, value: string, highlight = false) => `
    <div style="background:#111;border:1px solid #222;border-radius:10px;padding:16px 20px;margin-bottom:12px">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#666">${label}</p>
      <p style="margin:0;font-size:15px;font-weight:${highlight ? '700' : '400'};color:${highlight ? '#a78bfa' : '#fff'}">${value || '—'}</p>
    </div>`

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a0a2e 0%,#0d0d1a 100%);padding:32px;border-bottom:1px solid #1a1a1a;text-align:center">
      <p style="margin:0;font-size:28px;font-weight:800;letter-spacing:-.02em;color:#fff">
        <span style="color:#a78bfa">Σ</span> Sigma Shop
      </p>
      <p style="margin:8px 0 0;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.1em">Dashboard notifications</p>
    </div>

    <!-- Body -->
    <div style="padding:32px">
      <div style="display:inline-block;background:#7c3aed22;border:1px solid #7c3aed44;border-radius:99px;padding:6px 14px;margin-bottom:20px">
        <span style="font-size:12px;font-weight:600;color:#a78bfa;text-transform:uppercase;letter-spacing:.08em">🛍️ Nouvelle demande</span>
      </div>

      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff;line-height:1.2">
        ${prenom} veut une boutique ${offre || 'clé en main'}
      </h1>
      <p style="margin:0 0 28px;color:#666;font-size:14px">Reçu le ${date} à ${time}</p>

      ${card('Prénom', prenom)}
      ${card('Email client', `<a href="mailto:${email}" style="color:#a78bfa;text-decoration:none">${email}</a>`, false)}
      ${card('Offre choisie', offre, true)}
      ${card('Niche envisagée', niche)}

      <!-- Message -->
      <div style="background:#111;border:1px solid #222;border-radius:10px;padding:20px;margin-bottom:28px">
        <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#666">Message</p>
        <p style="margin:0;font-size:14px;color:#ddd;line-height:1.7;white-space:pre-wrap;border-left:3px solid #7c3aed;padding-left:14px">${message}</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center">
        <a href="mailto:${email}?subject=Re: Ta boutique ${encodeURIComponent(offre || 'Sigma Shop')}&body=Salut ${encodeURIComponent(prenom)},"
           style="display:inline-block;background:#7c3aed;color:#fff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:10px">
          Répondre à ${prenom} →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:20px 32px;text-align:center">
      <p style="margin:0;font-size:12px;color:#444">Sigma Shop © 2026 · Notification automatique</p>
    </div>

  </div>
</body>
</html>`
}

function clientEmailHtml(prenom: string, offre: string, niche: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a0a2e 0%,#0d0d1a 100%);padding:36px;border-bottom:1px solid #1a1a1a;text-align:center">
      <p style="margin:0 0 16px;font-size:32px;font-weight:800;color:#fff">
        <span style="color:#a78bfa">Σ</span> Sigma Shop
      </p>
      <div style="display:inline-block;background:#7c3aed22;border:1px solid #7c3aed55;border-radius:99px;padding:8px 20px">
        <span style="font-size:13px;font-weight:600;color:#a78bfa">Demande reçue 🚀</span>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:36px">
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#fff;line-height:1.3">
        Salut ${prenom} ! Ta demande est bien reçue.
      </h1>
      <p style="margin:0 0 28px;font-size:15px;color:#999;line-height:1.7">
        On a bien reçu ta demande pour une boutique <strong style="color:#a78bfa">${offre || 'clé en main'}</strong>.
        Notre équipe l'analyse et te répond sous <strong style="color:#fff">24h</strong> avec un plan d'action personnalisé.
      </p>

      <!-- Récap -->
      <div style="background:#111;border:1px solid #1e1040;border-radius:12px;padding:24px;margin-bottom:28px">
        <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#666;font-weight:600">Récap de ta demande</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:13px;width:130px;border-bottom:1px solid #1a1a1a">Offre choisie</td>
            <td style="padding:8px 0;font-weight:700;font-size:13px;color:#a78bfa;border-bottom:1px solid #1a1a1a">${offre || '—'}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:13px">Niche envisagée</td>
            <td style="padding:8px 0;font-size:13px;color:#ddd">${niche || 'Non précisée (on t\'aide à choisir)'}</td>
          </tr>
        </table>
      </div>

      <!-- Ce qui se passe ensuite -->
      <div style="margin-bottom:32px">
        <p style="margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#666;font-weight:600">Ce qui se passe maintenant</p>
        ${[
          ['⚡', 'Analyse de ta demande', 'Notre équipe examine ton projet et prépare une proposition sur mesure.'],
          ['📩', 'Réponse sous 24h', 'Tu reçois un email avec le plan d\'action, les détails et les prochaines étapes.'],
          ['🚀', 'Lancement en 48h', 'Une fois validé, ta boutique est construite et livrée en moins de 48h.'],
        ].map(([icon, title, desc]) => `
        <div style="display:flex;gap:14px;margin-bottom:16px">
          <div style="min-width:36px;height:36px;background:#1a0a2e;border:1px solid #2d1a4e;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;text-align:center;line-height:36px">${icon}</div>
          <div>
            <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#fff">${title}</p>
            <p style="margin:0;font-size:13px;color:#666;line-height:1.5">${desc}</p>
          </div>
        </div>`).join('')}
      </div>

      <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.6">
        Des questions en attendant ? Réponds directement à cet email, on est disponibles.
      </p>

      <!-- CTA -->
      <div style="text-align:center">
        <a href="mailto:${ADMIN_EMAIL}?subject=Question sur ma demande ${encodeURIComponent(offre || '')}"
           style="display:inline-block;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:10px">
          Poser une question
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:20px 32px;text-align:center">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#555"><span style="color:#a78bfa">Σ</span> Sigma Shop</p>
      <p style="margin:0;font-size:12px;color:#333">© 2026 · Contact : <a href="mailto:${ADMIN_EMAIL}" style="color:#555;text-decoration:none">${ADMIN_EMAIL}</a></p>
    </div>

  </div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { prenom, email, niche, offre, message } = body as Omit<Lead, 'id' | 'created_at'>

  if (!prenom || !email || !message) {
    return Response.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('leads').insert({
    prenom,
    email,
    niche: niche ?? '',
    offre: offre ?? '',
    message,
  })

  if (dbError) {
    console.error('Supabase insert error:', dbError)
    return Response.json({ error: 'Erreur base de données' }, { status: 500 })
  }

  const [adminMail, clientMail] = await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [ADMIN_EMAIL],
      subject: `🛍️ Nouvelle demande — ${prenom} veut une boutique ${offre || 'clé en main'}`,
      html: adminEmailHtml(prenom, email, offre, niche, message),
    }),
    resend.emails.send({
      from: FROM,
      to: [email],
      subject: `On a bien reçu ta demande, ${prenom} 🚀`,
      html: clientEmailHtml(prenom, offre, niche),
    }),
  ])

  if (adminMail.error) console.error('Resend admin error:', adminMail.error)
  if (clientMail.error) console.error('Resend client error:', clientMail.error)

  return Response.json({ success: true })
}
