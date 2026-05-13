import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import ProductCard from '../components/ProductCard'
import { API_URL } from '../config'

const FAQ_ITEMS = [
  {
    q: 'Vos parfums sont-ils 100% authentiques ?',
    a: 'Oui, absolument. Tous nos produits sont authentiques et originaux, achetés directement auprès des distributeurs officiels et des grandes maisons de parfumerie. Nous ne vendons aucune contrefaçon.',
  },
  {
    q: 'Quels sont les délais de livraison au Maroc ?',
    a: 'Nous livrons partout au Maroc en 24 à 48 heures ouvrables. La livraison est gratuite à partir de 499 MAD. Chaque commande est soigneusement emballée pour garantir la sécurité de vos produits.',
  },
  {
    q: 'Comment puis-je payer ma commande ?',
    a: 'Nous proposons le paiement à la livraison (cash). Vous payez uniquement à la réception de votre commande, ce qui vous garantit une totale sécurité.',
  },
  {
    q: 'Puis-je retourner un produit si je ne suis pas satisfait ?',
    a: 'Votre satisfaction est notre priorité. Si un produit ne correspond pas à vos attentes, contactez-nous via WhatsApp dans les 48h suivant la réception et nous trouverons une solution adaptée.',
  },
  {
    q: 'Comment contacter le service client ?',
    a: 'Notre équipe est disponible via WhatsApp au +212 663-432716, du lundi au samedi de 9h à 21h. Nous répondons généralement dans les 2 heures.',
  },
  {
    q: 'Proposez-vous des emballages cadeaux ?',
    a: 'Oui, chaque commande peut être emballée comme un cadeau élégant avec un message personnalisé, sans frais supplémentaires. Idéal pour les anniversaires, mariages et occasions spéciales.',
  },
]

/* Curated Unsplash images for categories without uploads */
const CATEGORY_IMGS = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556228578-626df0b29e95?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607602278658-a14f5fda8b3b?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587467512961-f90f84e2e5a7?w=500&auto=format&fit=crop&q=80',
]

const HERO_VISUAL = 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=700&auto=format&fit=crop&q=80'

const STATS = [
  { value: '+5 000', label: 'Produits' },
  { value: '+200', label: 'Marques' },
  { value: '100%', label: 'Authentique' },
  { value: '48h', label: 'Livraison' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const [fp, np, cp, bp] = await Promise.all([
          fetch(`${API_URL}/products?featured=true&limit=8`).then(r => r.json()),
          fetch(`${API_URL}/products?isNew=true&limit=8`).then(r => r.json()),
          fetch(`${API_URL}/categories`).then(r => r.json()),
          fetch(`${API_URL}/brands`).then(r => r.json()),
        ])
        setFeatured(fp.products || [])
        setNewArrivals(np.products || [])
        setCategories(cp || [])
        setBrands(bp || [])
      } catch {}
    }
    load()
  }, [])

  return (
    <>
      <Seo description="Votre parfumerie en ligne au Maroc. Parfums, soins et cosmétiques des plus grandes marques. Livraison partout au Maroc." />

      {/* ════ HERO ════ */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">

            {/* Left: content */}
            <div className="hero-content">
              <div className="hero-eyebrow anim-fadeInUp">Collection Exclusive 2025</div>

              <h1 className="hero-title anim-fadeInUp anim-delay-1">
                L'Art de la<br /><em>Parfumerie</em>
              </h1>

              <p className="hero-subtitle anim-fadeInUp anim-delay-2">
                Découvrez notre sélection exclusive de parfums, soins et cosmétiques
                des plus grandes maisons mondiales, livrés en 48h partout au Maroc.
              </p>

              <div className="hero-actions anim-fadeInUp anim-delay-3">
                <Link to="/produits" className="btn btn-gold btn-lg">
                  Explorer la collection
                </Link>
                <Link to="/produits?gender=femme" className="btn btn-outline-gold btn-lg">
                  Parfums Femme
                </Link>
              </div>

              <div className="hero-trust anim-fadeInUp anim-delay-4">
                <span className="hero-trust-item">100% Authentique</span>
                <span className="hero-trust-item">Livraison Express</span>
                <span className="hero-trust-item">Paiement à la livraison</span>
              </div>
            </div>

            {/* Right: visual */}
            <div className="hero-visual anim-fadeInRight">
              <div className="hero-visual-glow" />

              <img
                src={HERO_VISUAL}
                alt="Collection de parfums de luxe"
                className="hero-visual-img"
              />

              {/* Floating card — top left */}
              <div className="hero-float-card hero-float-card-1">
                <div className="hero-float-card-icon">⭐</div>
                <div>
                  <div className="hero-float-card-label">Satisfaction client</div>
                  <div className="hero-float-card-value">★★★★★  4.9/5</div>
                </div>
              </div>

              {/* Floating card — bottom right */}
              <div className="hero-float-card hero-float-card-2">
                <div className="hero-float-card-icon">🚚</div>
                <div>
                  <div className="hero-float-card-label">Livraison gratuite</div>
                  <div className="hero-float-card-value">Dès 499 MAD</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span>Défiler</span>
        </div>
      </section>

      {/* ════ STATS BAR ════ */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-bar-grid">
            {STATS.map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-item-value">{s.value}</div>
                <div className="stat-item-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ CATEGORIES ════ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Nos Collections</span>
            <h2 className="section-title">Explorez par Catégorie</h2>
            <div className="divider-gold" />
          </div>

          {categories.length > 0 ? (
            <div className="categories-grid">
              {categories.slice(0, 6).map((cat, i) => (
                <Link key={cat._id} to={`/produits?category=${cat._id}`} className="category-card">
                  <img
                    src={cat.image || CATEGORY_IMGS[i % CATEGORY_IMGS.length]}
                    alt={cat.name}
                    className="category-card-img"
                    loading="lazy"
                  />
                  <div className="category-card-overlay">
                    <span className="category-card-name">{cat.name}</span>
                    <span className="category-card-cta">Voir tout →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Demo grid while categories are empty */
            <div className="categories-grid">
              {[
                { label: 'Parfums Femme', img: CATEGORY_IMGS[0], q: 'gender=femme' },
                { label: 'Parfums Homme', img: CATEGORY_IMGS[1], q: 'gender=homme' },
                { label: 'Soins Corps',   img: CATEGORY_IMGS[2], q: '' },
                { label: 'Maquillage',    img: CATEGORY_IMGS[3], q: '' },
                { label: 'Coffrets',      img: CATEGORY_IMGS[4], q: '' },
                { label: 'Nouveautés',    img: CATEGORY_IMGS[5], q: 'isNew=true' },
              ].map(cat => (
                <Link key={cat.label} to={`/produits${cat.q ? '?' + cat.q : ''}`} className="category-card">
                  <img src={cat.img} alt={cat.label} className="category-card-img" loading="lazy" />
                  <div className="category-card-overlay">
                    <span className="category-card-name">{cat.label}</span>
                    <span className="category-card-cta">Voir tout →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ FEATURED PRODUCTS ════ */}
      {featured.length > 0 && (
        <section className="section" style={{ background: 'var(--color-surface)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Sélection Exclusive</span>
              <h2 className="section-title">Nos Coups de Cœur</h2>
              <div className="divider-gold" />
              <p className="section-subtitle" style={{ marginTop: 'var(--space-4)' }}>
                Une curation soignée des parfums et cosmétiques les plus appréciés
              </p>
            </div>
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <Link to="/produits?featured=true" className="btn btn-outline">
                Voir toute la sélection
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════ SPLIT PROMO BANNER ════ */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-banner-content">
            <span className="promo-banner-tag">Offre Limitée</span>
            <h2 className="promo-banner-title">
              Jusqu'à <em>−30%</em><br />sur les Parfums Orientaux
            </h2>
            <p className="promo-banner-sub">
              Profitez de nos offres exclusives sur une sélection de parfums orientaux et oud.
              Livraison gratuite incluse.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/produits" className="btn btn-gold btn-lg">
                Profiter de l'offre
              </Link>
              <Link to="/produits?gender=unisexe" className="btn btn-outline-gold btn-lg">
                Parfums Unisexe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════ NEW ARRIVALS ════ */}
      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Dernières Arrivées</span>
              <h2 className="section-title">Nouveautés</h2>
              <div className="divider-gold" />
            </div>
            <div className="grid-4">
              {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <Link to="/produits?isNew=true" className="btn btn-outline">
                Voir toutes les nouveautés
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════ BRANDS ════ */}
      {brands.length > 0 && (
        <section className="brands-strip">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <span className="section-label" style={{ color: 'rgba(255,255,255,0.45)' }}>Marques Disponibles</span>
            </div>
            <div className="brands-row">
              {[...brands, ...brands].map((b, i) => (
                <Link key={`${b._id}-${i}`} to={`/produits?brand=${b._id}`} className="brand-logo-item">
                  {b.logo
                    ? <img src={b.logo} alt={b.name} />
                    : <span className="brand-logo-text">{b.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ WHY US — full image background ════ */}
      <section
        className="section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--color-surface)',
        }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pourquoi Nous Choisir</span>
            <h2 className="section-title">L'Excellence à Votre Service</h2>
            <div className="divider-gold" />
          </div>
          <div className="values-grid">
            {[
              {
                icon: '🏆',
                title: 'Produits Authentiques',
                desc: '100% de nos produits sont authentiques et originaux, importés directement des meilleures maisons mondiales.',
              },
              {
                icon: '🚚',
                title: 'Livraison Rapide',
                desc: 'Livraison en 24–48h partout au Maroc. Gratuite dès 499 MAD. Chaque commande est emballée avec soin.',
              },
              {
                icon: '💬',
                title: 'Service Client',
                desc: 'Notre équipe de conseillers est disponible via WhatsApp pour vous guider vers le parfum idéal.',
              },
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

      {/* ════ FAQ ════ */}
      <section className="section">
        <div className="container" style={{ maxWidth: '780px' }}>
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions Fréquentes</h2>
            <div className="divider-gold" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {FAQ_ITEMS.map(({ q, a }) => (
              <details key={q} style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 500, fontSize: '1rem', color: 'var(--color-text)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-2) 0' }}>
                  {q}
                  <span style={{ color: 'var(--color-accent)', fontSize: '1.25rem', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ marginTop: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.75 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      })}} />
    </>
  )
}
