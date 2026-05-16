import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { openCart } from './CartDrawer'

const NAV_LINKS = [
  { label: 'Accueil', to: '/', end: true },
  {
    label: 'Parfum',
    to: '/produits?category=parfum',
    categorySlug: 'parfum',
    children: [
      { label: 'Parfum Femme',            to: '/produits?category=parfum&gender=femme' },
      { label: 'Parfum Homme',            to: '/produits?category=parfum&gender=homme' },
      { label: 'Parfum Mixte',            to: '/produits?category=parfum&gender=unisexe' },
      { label: 'Coffret Femme',           to: '/produits?category=parfum&gender=femme' },
      { label: 'Coffret Homme',           to: '/produits?category=parfum&gender=homme' },
      { label: 'Échantillons de Parfums', to: '/produits?category=parfum' },
      { label: "Parfums d'intérieur",     to: '/produits?category=parfum' },
    ],
  },
  {
    label: 'Maquillage',
    to: '/produits?category=maquillage',
    categorySlug: 'maquillage',
    children: [
      { label: 'Yeux',                to: '/produits?category=maquillage' },
      { label: 'Teint',               to: '/produits?category=maquillage' },
      { label: 'Lèvres',              to: '/produits?category=maquillage' },
      { label: 'Ongles',              to: '/produits?category=maquillage' },
      { label: 'Palettes et coffrets', to: '/produits?category=maquillage' },
    ],
  },
  {
    label: 'Soin Visage',
    to: '/produits?category=soin-visage',
    categorySlug: 'soin-visage',
    children: [
      { label: 'Nettoyant et Démaquillant', to: '/produits?category=soin-visage' },
      { label: 'Hydratant & Nourrissant',   to: '/produits?category=soin-visage' },
      { label: 'Anti-Rides et Anti-Âge',    to: '/produits?category=soin-visage' },
      { label: 'Masque et Gommage',          to: '/produits?category=soin-visage' },
      { label: 'BB Crème et CC Crème',       to: '/produits?category=soin-visage' },
      { label: 'Soins Spécifiques',          to: '/produits?category=soin-visage' },
    ],
  },
  {
    label: 'Corps et Bain',
    to: '/produits?category=corps-et-bain',
    categorySlug: 'corps-et-bain',
    children: [
      { label: 'Déodorant',                to: '/produits?category=corps-et-bain' },
      { label: 'Hydratant et Nourrissant', to: '/produits?category=corps-et-bain' },
      { label: 'Minceur et Fermeté',       to: '/produits?category=corps-et-bain' },
      { label: 'Mains et Pieds',           to: '/produits?category=corps-et-bain' },
      { label: 'Hygiène et Bain',          to: '/produits?category=corps-et-bain' },
    ],
  },
  {
    label: 'Homme',
    to: '/produits?category=homme',
    categorySlug: 'homme',
    children: [
      { label: 'Parfum',    to: '/produits?category=homme' },
      { label: 'Déodorant', to: '/produits?category=homme' },
      { label: 'Coffret',   to: '/produits?category=homme' },
      { label: 'Rasage',    to: '/produits?category=homme' },
    ],
  },
  {
    label: 'Cheveux',
    to: '/produits?category=cheveux',
    categorySlug: 'cheveux',
    children: [
      { label: 'Shampooing',          to: '/produits?category=cheveux' },
      { label: 'Après-shampooing',    to: '/produits?category=cheveux' },
      { label: 'Masque',              to: '/produits?category=cheveux' },
      { label: 'Soin cheveux',        to: '/produits?category=cheveux' },
      { label: 'Coiffant & Fixant',   to: '/produits?category=cheveux' },
      { label: 'Accessoires cheveux', to: '/produits?category=cheveux' },
    ],
  },
  { label: 'Promotions',  to: '/produits?onPromo=true', promo: true },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function isLinkActive(link, pathIsActive) {
    if (link.categorySlug) {
      const params = new URLSearchParams(location.search)
      return location.pathname === '/produits' && params.get('category') === link.categorySlug
    }
    return !link.children && pathIsActive
  }

  function handleSearch(e) {
    e.preventDefault()
    const q = search.trim()
    if (q) {
      navigate(`/produits?search=${encodeURIComponent(q)}`)
      setSearch('')
      setMenuOpen(false)
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* ── Logo ── */}
        <div className="navbar-logo-col">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Selective Market" className="navbar-logo-img" height="68" />
          </Link>
        </div>

        {/* ── Center: search + nav ── */}
        <div className="navbar-center">

          <form className="navbar-search-form" onSubmit={handleSearch} role="search">
            <input
              type="search"
              className="navbar-search-input"
              placeholder="Rechercher un parfum, une marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Rechercher"
            />
            <button type="submit" className="navbar-search-btn" aria-label="Lancer la recherche">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          <nav className="navbar-nav" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => {
              const { label, to, end, children, promo, categorySlug } = link
              return (
              <div key={label} className={`nav-item${children ? ' nav-item-has-dropdown' : ''}`}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `navbar-nav-link${isLinkActive(link, isActive) ? ' active' : ''}${promo ? ' navbar-nav-promo' : ''}`
                  }
                >
                  {label}
                  {children && (
                    <svg className="nav-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </NavLink>

                {children && (
                  <div className="nav-dropdown">
                    {children.map(child => (
                      <Link key={child.label} to={child.to} className="nav-dropdown-item">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )})}
          </nav>

        </div>

        {/* ── Actions ── */}
        <div className="navbar-actions">

          <button
            className="navbar-action-btn"
            onClick={openCart}
            aria-label="Ouvrir le panier"
            title="Panier"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalItems > 0 && <span className="navbar-badge">{totalItems}</span>}
          </button>

        </div>

        {/* ── Hamburger ── */}
        <button
          className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <nav className="navbar-mobile-menu" aria-label="Menu mobile">
          <form className="navbar-mobile-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Rechercher un parfum, une marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Rechercher"
            />
            <button type="submit" aria-label="Lancer la recherche">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          {NAV_LINKS.map(({ label, to, end, children, promo }) => (
            <div key={label}>
              {children ? (
                <Link
                  to={to}
                  className={`navbar-mobile-link${promo ? ' navbar-mobile-link-promo' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ) : (
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `navbar-mobile-link${isActive ? ' active' : ''}${promo ? ' navbar-mobile-link-promo' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
