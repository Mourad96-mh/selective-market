import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function About() {
  return (
    <>
      <Seo title="À propos" description="Découvrez notre parfumerie en ligne à Casablanca : parfums authentiques, soins de luxe et cosmétiques des plus grandes maisons mondiales. Livraison express 48h au Maroc." keywords="parfumerie casablanca, parfums originaux maroc, cosmétiques luxe maroc, à propos parfumerie" />

      <div className="about-hero">
        <div className="container">
          <span className="section-label">Notre Histoire</span>
          <h1 className="about-hero-title">
            L'<em>Excellence</em> au Service<br />de la Beauté
          </h1>
          <p className="about-hero-sub">
            Votre destination beauté de confiance au Maroc depuis des années.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center', maxWidth: '960px', margin: '0 auto' }}>
            <div>
              <span className="section-label">Qui Sommes-Nous</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Une Passion pour les Belles Fragrances</h2>
              <div style={{ height: '2px', width: '60px', background: 'var(--color-accent)', margin: 'var(--space-4) 0' }} />
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                Née d'une passion profonde pour les belles fragrances et la beauté, notre parfumerie a été fondée avec une mission claire : rendre accessibles les plus beaux parfums et cosmétiques du monde à tous les Marocains.
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                Nous sélectionnons soigneusement chaque produit de notre catalogue pour vous garantir authenticité, qualité et un service exceptionnel. Que vous cherchiez votre parfum signature ou un cadeau parfait, nous avons ce qu'il vous faut.
              </p>
              <Link to="/produits" className="btn btn-primary">Découvrir notre catalogue</Link>
            </div>
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '400px' }}>
              <img
                src="https://images.unsplash.com/photo-1592945403407-9caf930b7bc2?w=800&h=800&auto=format&fit=crop&q=80"
                alt="Parfums de luxe — Selective Market"
                width={800}
                height={800}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Nos Engagements</span>
            <h2 className="section-title">Ce Qui Nous Différencie</h2>
            <div className="divider-gold" />
          </div>
          <div className="values-grid">
            {[
              { icon: '✅', title: 'Authenticité Garantie', desc: '100% de nos produits sont authentiques et originaux, achetés directement auprès des distributeurs officiels et grandes maisons de parfumerie.' },
              { icon: '🚀', title: 'Livraison Express', desc: 'Nous livrons dans toute le Maroc en 24 à 48 heures. Chaque commande est emballée avec soin pour que vos produits arrivent en parfait état.' },
              { icon: '💬', title: 'Conseils Personnalisés', desc: 'Notre équipe de conseillers beauté est disponible via WhatsApp et par téléphone pour vous aider à trouver les produits qui correspondent à vos envies.' },
              { icon: '🔄', title: 'Satisfaction Garantie', desc: 'Votre satisfaction est notre priorité. Si un produit ne correspond pas à vos attentes, nous trouvons toujours une solution.' },
              { icon: '🎁', title: 'Emballages Cadeaux', desc: 'Chaque commande peut être emballée comme un cadeau élégant avec un message personnalisé. Idéal pour toutes les occasions.' },
              { icon: '💰', title: 'Meilleurs Prix', desc: 'Nous négocions les meilleurs prix pour vous offrir des produits premium à des tarifs compétitifs, avec des promotions régulières.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-banner-content">
            <span className="promo-banner-tag">Contactez-nous</span>
            <h2 className="promo-banner-title">Besoin d'un <em>Conseil ?</em></h2>
            <p className="promo-banner-sub">Notre équipe est disponible pour vous aider à trouver le parfum idéal.</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-gold btn-lg">Nous contacter</Link>
              <a href="https://wa.me/212663432716" target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold btn-lg">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
