'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'

/* ─── SVG icons ────────────────────────────────────────────────────── */

function IconZap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconHeadphones() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  )
}

function IconTrendingUp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconGitBranch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400 mx-auto">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-yellow-400">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
    </svg>
  )
}

/* ─── helpers ──────────────────────────────────────────────────────── */

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const step = target / 60
    const t = setInterval(() => {
      cur += step
      if (cur >= target) { setValue(target); clearInterval(t) }
      else setValue(Math.floor(cur))
    }, 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{value}{suffix}</span>
}

function Divider() {
  return (
    <div className="flex items-center gap-4 px-6 max-w-6xl mx-auto py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <div className="h-1 w-1 rounded-full bg-violet-500/40" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </div>
  )
}

/* ─── types ─────────────────────────────────────────────────────────── */

type FormState = { prenom: string; email: string; niche: string; offre: string; message: string }
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

/* ─── page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [form, setForm] = useState<FormState>({ prenom: '', email: '', niche: '', offre: '', message: '' })
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 20))

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  function selectOffer(offre: string) {
    setForm((p) => ({ ...p, offre }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors w-full'
  const shimmerBtn = 'relative overflow-hidden inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-500'

  /* ── data ── */
  const stats = [
    { value: 48, suffix: 'h', label: 'Livraison garantie' },
    { value: 120, suffix: '+', label: 'Boutiques livrées' },
    { value: 98, suffix: '%', label: 'Clients satisfaits' },
  ]

  const problems = [
    { icon: <IconTrendingUp />, title: "Des frais qui s'accumulent", body: "Abonnement mensuel, apps payantes, thèmes premium, frais de transaction… tu dépenses avant même d'avoir fait une vente." },
    { icon: <IconClock />, title: 'Des semaines de configuration', body: "Design, produits, fiches, paiements, domaine, emails — chaque étape est un obstacle. La courbe d'apprentissage est brutale." },
    { icon: <IconGitBranch />, title: 'Trop de décisions à prendre', body: "Quelle niche ? Quel fournisseur ? Quel thème ? Trop de choix tue l'action. La plupart n'ouvrent jamais." },
  ]

  const features = [
    { icon: <IconZap />, title: 'Livraison en 48h', body: "Ta boutique est construite, testée et livrée en moins de 48h. Zéro attente, zéro friction — tu vends dès le premier jour." },
    { icon: <IconTarget />, title: 'Niche & produits sélectionnés', body: 'Nos experts choisissent une niche rentable et des produits à fort potentiel avec fournisseurs validés et marges calculées.' },
    { icon: <IconHeadphones />, title: 'Support & accompagnement', body: "Un accès direct à notre équipe après livraison. Questions, ajustements, conseils — on reste là pour que tu réussisses." },
  ]

  const plans = [
    {
      name: 'Starter', price: '49', popular: false,
      desc: "Pour démarrer rapidement avec l'essentiel.",
      features: ['Boutique clé en main', '5 produits max', 'Design professionnel', 'Admin basique', 'Configuration paiement', 'Support 7 jours'],
    },
    {
      name: 'Pro', price: '99', popular: true,
      desc: "Le plus choisi. Tout ce qu'il faut pour scaler.",
      features: ['Tout Starter, plus :', 'Produits illimités', 'Admin complet', 'Intégration Stripe', 'SEO on-page complet', 'Emails automatisés', 'Support 30 jours'],
    },
    {
      name: 'Premium', price: '199', popular: false,
      desc: 'La boutique clé en main absolue, sans compromis.',
      features: ['Tout Pro, plus :', 'Nom de domaine inclus', '1 mois de support dédié', 'Branding complet', 'Publicité Meta configurée', 'Session stratégie 1h'],
    },
  ]

  const steps = [
    { step: '01', title: 'Tu commandes en ligne', body: 'Tu choisis ton offre, tu remplis un court formulaire et tu procèdes au paiement sécurisé.' },
    { step: '02', title: 'On construit ta boutique', body: 'Notre équipe monte ta boutique de A à Z. Chaque détail est optimisé pour convertir.' },
    { step: '03', title: 'Tu reçois les accès & tu vends', body: 'En moins de 48h tu reçois tous les accès. Ta boutique est live et prête à générer des ventes.' },
  ]

  const testimonials = [
    { initials: 'KM', name: 'Karim M.', role: 'Offre Pro', text: "J'avais essayé de lancer ma boutique seul pendant 2 mois. Avec Sigma Shop, elle était live en 48h et j'ai fait ma première vente le lendemain." },
    { initials: 'SL', name: 'Sarah L.', role: 'Offre Premium', text: "Le support est incroyable. Chaque question a eu une réponse rapide. Ma boutique tourne toute seule, je me concentre juste sur la pub." },
    { initials: 'TN', name: 'Thomas N.', role: 'Offre Starter', text: "Rapport qualité/prix imbattable. Pour 49€ j'ai une boutique qui a l'air de valoir 10x plus. Je recommande sans hésiter." },
  ]

  const navLinks = [['#pourquoi', 'Pourquoi nous'], ['#solution', 'Solution'], ['#pricing', 'Tarifs'], ['#avis', 'Avis'], ['#contact', 'Contact']]

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white font-sans"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,58,237,0.07) 1px, transparent 0)', backgroundSize: '32px 32px' }}
    >

      {/* ── NAVBAR ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: scrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0)',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-tight"><span className="text-violet-400">Σ</span> Sigma Shop</span>
          <ul className="hidden md:flex items-center gap-8 text-sm text-white/60">
            {navLinks.map(([href, label]) => (
              <li key={href}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
            ))}
          </ul>
          <div className="hidden md:flex items-center gap-3">
            <a href="/auth/login" className="text-sm px-4 py-2 rounded-lg border border-violet-500 text-violet-400 hover:bg-violet-500/10 transition-colors">
              Mon espace
            </a>
            <a href="#pricing" className={`${shimmerBtn} bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-lg`}>
              Voir les offres
            </a>
          </div>
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0f0f0f] px-6 py-4 flex flex-col gap-4 text-sm text-white/70 overflow-hidden"
            >
              {navLinks.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">{label}</a>
              ))}
              <a href="/auth/login" onClick={() => setMenuOpen(false)} className="inline-flex justify-center border border-violet-500 text-violet-400 font-semibold py-2 rounded-lg hover:bg-violet-500/10 transition-colors">
                Mon espace
              </a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="inline-flex justify-center bg-violet-600 text-white font-semibold py-2 rounded-lg">
                Voir les offres
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet-700/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-block mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400"
          >
            Boutique dropshipping clé en main
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Lance ta boutique
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-violet-500 bg-clip-text text-transparent">
              en 48h, sans galère.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Nous créons pour toi une boutique dropshipping rentable, optimisée et prête à vendre — sans les mois de configuration ni les frais Shopify exorbitants.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#pricing" className={`${shimmerBtn} bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl text-base shadow-lg shadow-violet-900/40`}>
              Choisir mon offre →
            </a>
            <a href="#comment" className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-colors font-semibold px-8 py-4 rounded-xl text-base">
              Comment ça marche
            </a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-xs text-white/30">
            Livraison en 48h · Support inclus · Pas d'abonnement caché
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 border border-white/5 rounded-2xl bg-white/3 p-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-extrabold text-violet-400"><Counter target={s.value} suffix={s.suffix} /></span>
                <span className="text-xs text-white/40 text-center">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── POURQUOI PAS SHOPIFY ── */}
      <section id="pourquoi" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Le problème</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Pourquoi pas Shopify tout seul ?</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">Des milliers de gens essaient chaque mois. La plupart abandonnent pour les mêmes raisons.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-red-500/10 bg-[#111111] p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center text-red-400 mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── NOTRE SOLUTION ── */}
      <section id="solution" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Notre solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Tout fait. Tout optimisé. Prêt à vendre.</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">On s'occupe de A à Z. Tu reçois une boutique qui tourne, pas un projet à finir.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group rounded-2xl border border-violet-500/15 bg-[#111111] p-8 h-full cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5 group-hover:bg-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Tarifs</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Un prix fixe. Pas de surprise.</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">Paiement unique, tout inclus. Pas d'abonnement, pas de frais cachés.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <FadeUp key={plan.name} delay={i * 0.1}>
                {/* wrapper avec overflow-visible pour que le badge ne soit pas coupé */}
                <div className="relative pt-5">
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-lg shadow-violet-900/40">
                      Populaire
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative rounded-2xl p-8 flex flex-col bg-[#111111]"
                    style={plan.popular
                      ? { boxShadow: '0 0 0 2px #7c3aed, 0 20px 60px -10px rgba(124,58,237,0.25)' }
                      : { border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {plan.popular && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        animate={{ boxShadow: ['0 0 0 2px #7c3aed', '0 0 0 2px #a78bfa, 0 0 24px rgba(124,58,237,0.35)', '0 0 0 2px #7c3aed'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest">{plan.name}</p>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-5xl font-extrabold text-white">{plan.price}€</span>
                      <span className="text-white/40 mb-2 text-sm">/ unique</span>
                    </div>
                    <p className="mt-3 text-white/50 text-sm">{plan.desc}</p>
                    <ul className="mt-6 flex flex-col gap-3 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="text-violet-400 mt-0.5 shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => selectOffer(plan.name)}
                      className={`${shimmerBtn} mt-8 w-full py-3 rounded-xl ${
                        plan.popular
                          ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40'
                          : 'border border-white/15 hover:border-white/30 text-white/80 hover:text-white'
                      }`}
                    >
                      Choisir {plan.name}
                    </button>
                  </motion.div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="comment" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">3 étapes simples entre ta commande et ta boutique opérationnelle.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.12}>
                <div className="relative flex flex-col items-start">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-violet-500/40 to-transparent -translate-x-8" />
                  )}
                  <span className="text-6xl font-black text-violet-500/20 leading-none">{item.step}</span>
                  <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-white/50 text-sm leading-relaxed">{item.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── TÉMOIGNAGES ── */}
      <section id="avis" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Témoignages</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Ils nous font confiance</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">Des entrepreneurs qui ont sauté le pas. Voici ce qu'ils en disent.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="rounded-2xl border border-white/8 bg-[#111111] p-7 flex flex-col gap-4 h-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-violet-400">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, k) => <StarIcon key={k} />)}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">"{t.text}"</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6">
        <div className="mx-auto max-w-2xl">
          <FadeUp className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Prêt à lancer ta boutique ?</h2>
            <p className="mt-4 text-white/50">Envoie-nous un message — on te répond sous 24h avec un plan d'action personnalisé.</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-violet-500/30 bg-[#111111] p-12 text-center"
              >
                <IconCheckCircle />
                <p className="mt-4 text-xl font-bold">Demande envoyée !</p>
                <p className="mt-2 text-white/50">On te répond sous 24h. Prépare-toi à lancer.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#111111] p-8 flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60 font-medium">Prénom</label>
                    <input required type="text" placeholder="Jean" value={form.prenom} onChange={set('prenom')} className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60 font-medium">Email</label>
                    <input required type="email" placeholder="jean@exemple.fr" value={form.email} onChange={set('email')} className={inputCls} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60 font-medium">Offre souhaitée</label>
                    <select value={form.offre} onChange={set('offre')} className={`${inputCls} appearance-none`}>
                      <option value="" disabled>Choisir une offre…</option>
                      <option value="Starter">Starter — 49 €</option>
                      <option value="Pro">Pro — 99 €</option>
                      <option value="Premium">Premium — 199 €</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60 font-medium">
                      Niche envisagée <span className="text-white/30">(optionnel)</span>
                    </label>
                    <input type="text" placeholder="Ex : fitness, animaux…" value={form.niche} onChange={set('niche')} className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/60 font-medium">Message / détails sur ton projet</label>
                  <textarea
                    required rows={5}
                    placeholder="Décris ton projet, tes questions, ton budget, tes délais…"
                    value={form.message} onChange={set('message')}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-400 text-center">Une erreur est survenue, réessaie dans quelques secondes.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`${shimmerBtn} w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl shadow-lg shadow-violet-900/40`}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Envoi en cours…
                    </>
                  ) : 'Envoyer ma demande →'}
                </button>
                <p className="text-center text-xs text-white/25">Tes données restent privées. Pas de spam, jamais.</p>
              </form>
            )}
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-6 flex items-start gap-4 rounded-xl border border-violet-500/25 bg-[#111111] p-5">
              <div className="mt-0.5 shrink-0 text-violet-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Comment payer ?</p>
                <p className="text-sm text-white/55 leading-relaxed">
                  Une fois ta demande envoyée, on te confirme tout par mail et on t'envoie les coordonnées de virement.
                  La boutique est livrée sous 48h après réception du paiement.
                </p>
                <p className="mt-2 text-xs text-white/30">Virement bancaire · Sécurisé · Sans frais</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span className="font-bold text-white/50"><span className="text-violet-400">Σ</span> Sigma Shop</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white/60 transition-colors">CGV</a>
            <a href="#contact" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
          <span>
            © {new Date().getFullYear()} Sigma Shop. Tous droits réservés.{' '}
            <a href="/admin" className="text-white/10 hover:text-white/30 transition-colors">·</a>
          </span>
        </div>
      </footer>

    </div>
  )
}
