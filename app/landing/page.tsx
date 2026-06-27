'use client'

import { useState } from 'react'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-violet-400">Σ</span> Sigma Shop
          </span>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <li><a href="#pourquoi" className="hover:text-white transition-colors">Pourquoi nous</a></li>
            <li><a href="#solution" className="hover:text-white transition-colors">Solution</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
            <li><a href="#comment" className="hover:text-white transition-colors">Comment ça marche</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>

          <a
            href="#pricing"
            className="hidden md:inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Voir les offres
          </a>

          {/* Burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0f0f0f] px-6 py-4 flex flex-col gap-4 text-sm text-white/70">
            {['#pourquoi', '#solution', '#pricing', '#comment', '#contact'].map((href) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">
                {href.replace('#', '').replace('pourquoi', 'Pourquoi nous').replace('solution', 'Solution').replace('pricing', 'Tarifs').replace('comment', 'Comment ça marche').replace('contact', 'Contact')}
              </a>
            ))}
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex justify-center bg-violet-600 text-white font-semibold py-2 rounded-lg">
              Voir les offres
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Boutique dropshipping clé en main
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Lance ta boutique
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              en 48h, sans galère.
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Nous créons pour toi une boutique dropshipping rentable, optimisée et prête à vendre — sans les mois de configuration ni les frais Shopify exorbitants.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-violet-900/40"
            >
              Choisir mon offre →
            </a>
            <a
              href="#comment"
              className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-colors font-semibold px-8 py-4 rounded-xl text-base"
            >
              Comment ça marche
            </a>
          </div>

          <p className="mt-6 text-xs text-white/30">Livraison en 48h · Support inclus · Pas d'abonnement caché</p>
        </div>
      </section>

      {/* ── POURQUOI PAS SHOPIFY ── */}
      <section id="pourquoi" className="py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Le problème</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Pourquoi pas Shopify tout seul ?</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Des milliers de gens essaient chaque mois. La plupart abandonnent pour les mêmes raisons.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '💸',
                title: 'Des frais qui s\'accumulent',
                body: 'Abonnement mensuel, apps payantes, thèmes premium, frais de transaction… tu dépenses avant même d\'avoir fait une vente.',
              },
              {
                icon: '⏳',
                title: 'Des semaines de configuration',
                body: 'Design, produits, fiches, paiements, domaine, emails — chaque étape est un obstacle. La courbe d\'apprentissage est brutale.',
              },
              {
                icon: '🤯',
                title: 'Trop de décisions à prendre',
                body: 'Quelle niche ? Quel fournisseur ? Quel thème ? Trop de choix tue l\'action. La plupart n\'ouvrent jamais.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-red-500/10 bg-red-500/5 p-8"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTRE SOLUTION ── */}
      <section id="solution" className="py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Notre solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Tout fait. Tout optimisé. Prêt à vendre.</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              On s'occupe de A à Z. Tu reçois une boutique qui tourne, pas un projet à finir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Livraison en 48h',
                body: 'Ta boutique est construite, testée et livrée en moins de 48 heures. Zéro attente, zéro friction — tu vends dès le premier jour.',
              },
              {
                icon: '🎯',
                title: 'Niche & produits sélectionnés',
                body: 'Nos experts choisissent une niche rentable et des produits à fort potentiel avec fournisseurs validés et marges calculées.',
              },
              {
                icon: '🛡️',
                title: 'Support & accompagnement',
                body: 'Un accès direct à notre équipe après livraison. Questions, ajustements, conseils — on reste là pour que tu réussisses.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-8 hover:border-violet-500/30 transition-colors"
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Tarifs</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Un prix fixe. Pas de surprise.</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              Paiement unique, tout inclus. Pas d'abonnement, pas de frais cachés.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              {
                name: 'Starter',
                price: '149',
                popular: false,
                desc: 'Pour démarrer rapidement avec l\'essentiel.',
                features: [
                  'Boutique Next.js / WooCommerce',
                  '10 produits importés',
                  'Design professionnel',
                  'Configuration paiement',
                  'Domaine personnalisé',
                  'Support 7 jours',
                ],
              },
              {
                name: 'Pro',
                price: '299',
                popular: true,
                desc: 'Le plus choisi. Tout ce qu\'il faut pour scaler.',
                features: [
                  'Tout Starter, plus :',
                  '30 produits importés',
                  'Niche analysée par nos experts',
                  'SEO on-page complet',
                  'Emails automatisés',
                  'Support 30 jours',
                  'Formation vidéo offerte',
                ],
              },
              {
                name: 'Premium',
                price: '499',
                popular: false,
                desc: 'La boutique clé en main absolue, sans compromis.',
                features: [
                  'Tout Pro, plus :',
                  '60 produits importés',
                  'Publicité Meta configurée',
                  'Branding complet (logo, charte)',
                  'Fiche produit copywritée',
                  'Support 60 jours prioritaire',
                  'Session stratégie 1h',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? 'border-2 border-violet-500 bg-violet-500/10 shadow-xl shadow-violet-900/30'
                    : 'border border-white/10 bg-white/3'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ Le plus populaire
                  </span>
                )}
                <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest">{plan.name}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-5xl font-extrabold">{plan.price}€</span>
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

                <a
                  href="#contact"
                  className={`mt-8 block text-center font-bold py-3 rounded-xl transition-colors ${
                    plan.popular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40'
                      : 'border border-white/15 hover:border-white/30 text-white/80 hover:text-white'
                  }`}
                >
                  Choisir {plan.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="comment" className="py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto">
              3 étapes simples entre ta commande et ta boutique opérationnelle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tu commandes en ligne',
                body: 'Tu choisis ton offre, tu remplis un court formulaire (niche souhaitée, préférences, domaine) et tu procèdes au paiement sécurisé.',
              },
              {
                step: '02',
                title: 'On construit ta boutique',
                body: 'Notre équipe monte ta boutique de A à Z — design, produits, paiements, SEO, emails. Chaque détail est optimisé pour convertir.',
              },
              {
                step: '03',
                title: 'Tu reçois les accès & tu vends',
                body: 'En moins de 48h tu reçois tous les accès. Ta boutique est live. Tu commences à vendre avec notre support à disposition.',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-start">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-violet-500/40 to-transparent -translate-x-8" />
                )}
                <span className="text-6xl font-black text-violet-500/20 leading-none">{item.step}</span>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-white/50 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Prêt à lancer ta boutique ?</h2>
            <p className="mt-4 text-white/50">
              Envoie-nous un message — on te répond sous 24h avec un plan d'action personnalisé.
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-12 text-center">
              <span className="text-5xl">🎉</span>
              <p className="mt-4 text-xl font-bold">Message envoyé !</p>
              <p className="mt-2 text-white/50">On te répond dans les 24h. Prépare-toi à lancer.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/3 p-8 flex flex-col gap-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/60 font-medium">Prénom & Nom</label>
                  <input
                    required
                    type="text"
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/60 font-medium">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="jean@exemple.fr"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/60 font-medium">Ton message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Quelle offre t'intéresse ? Une niche en tête ? Des questions ?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 transition-colors text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-900/40"
              >
                Envoyer ma demande →
              </button>

              <p className="text-center text-xs text-white/25">
                Tes données restent privées. Pas de spam, jamais.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span className="font-bold text-white/50">
            <span className="text-violet-400">Σ</span> Sigma Shop
          </span>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white/60 transition-colors">CGV</a>
            <a href="#contact" className="hover:text-white/60 transition-colors">Contact</a>
          </div>

          <span>© {new Date().getFullYear()} Sigma Shop. Tous droits réservés.</span>
        </div>
      </footer>

    </div>
  )
}
