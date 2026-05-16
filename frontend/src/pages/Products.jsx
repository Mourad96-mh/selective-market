import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import ProductCard from '../components/ProductCard'
import { API_URL } from '../config'

const CONCENTRATIONS = [
  'Eau de Cologne', 'Eau de Toilette', 'Eau de Parfum',
  'Eau de Parfum Intense', 'Eau de Parfum Absolute', 'Eau de Parfum Fruitée',
  'Extrait de Parfum', 'Parfum Elixir', 'Parfum de peau',
  'Eau Fraîche', 'Eau Intense', 'Parfum',
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Plus récents' },
  { value: 'featured',   label: 'En vedette' },
  { value: 'price_asc',  label: 'Prix : faible à élevé' },
  { value: 'price_desc', label: 'Prix : élevé à faible' },
  { value: 'name_asc',   label: 'Alphabétique A → Z' },
  { value: 'name_desc',  label: 'Alphabétique Z → A' },
]

const GENDERS = [
  { value: '',        label: 'Tous' },
  { value: 'femme',   label: 'Femme' },
  { value: 'homme',   label: 'Homme' },
  { value: 'unisexe', label: 'Mixte' },
]

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '200ms ease', flexShrink: 0 }}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FilterGroup({ label, open, onToggle, children }) {
  return (
    <div className="filter-group">
      <button className="filter-group-header" onClick={onToggle}>
        <span className="filter-group-label">{label}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="filter-group-body">{children}</div>}
    </div>
  )
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]     = useState([])
  const [total, setTotal]           = useState(0)
  const [pages, setPages]           = useState(1)
  const [loading, setLoading]       = useState(true)
  const [categories, setCategories] = useState([])
  const [brands, setBrands]         = useState([])
  const [brandSearch, setBrandSearch] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [openGroups, setOpenGroups] = useState(() => {
    const desktop = window.innerWidth >= 768
    return {
      concentrations: desktop, genre: desktop, categories: desktop, marques: desktop, prix: false, selection: false,
    }
  })

  const search        = searchParams.get('search')        || ''
  const category      = searchParams.get('category')      || ''
  const brand         = searchParams.get('brand')         || ''
  const gender        = searchParams.get('gender')        || ''
  const concentration = searchParams.get('concentration') || ''
  const featured      = searchParams.get('featured')      || ''
  const isNew         = searchParams.get('isNew')         || ''
  const inStock       = searchParams.get('inStock')       || ''
  const onPromo       = searchParams.get('onPromo')       || ''
  const minPrice      = searchParams.get('minPrice')      || ''
  const maxPrice      = searchParams.get('maxPrice')      || ''
  const sort          = searchParams.get('sort')          || 'newest'
  const page          = Number(searchParams.get('page') || 1)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/categories`).then(r => r.json()),
      fetch(`${API_URL}/brands`).then(r => r.json()),
    ]).then(([cats, bs]) => {
      setCategories(cats || [])
      setBrands(bs || [])
    })
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 12, sort })
      if (search)        params.set('search', search)
      if (category)      params.set('category', category)
      if (brand)         params.set('brand', brand)
      if (gender)        params.set('gender', gender)
      if (concentration) params.set('concentration', concentration)
      if (featured)      params.set('featured', 'true')
      if (isNew)    params.set('isNew', 'true')
      if (inStock)  params.set('inStock', 'true')
      if (onPromo)  params.set('onPromo', 'true')
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)

      const res  = await fetch(`${API_URL}/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search, category, brand, gender, concentration, featured, isNew, inStock, onPromo, minPrice, maxPrice, sort, page])

  useEffect(() => { loadProducts() }, [loadProducts])

  function setParam(key, val) {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    if (key !== 'page') p.delete('page')
    setSearchParams(p)
  }

  function clearFilters() {
    setSearchParams({})
    setBrandSearch('')
  }

  function toggleGroup(key) {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const hasFilters = search || category || brand || gender || concentration || featured || isNew || inStock || onPromo || minPrice || maxPrice

  const filteredBrands = brandSearch
    ? brands.filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands

  const activeCategory = categories.find(c => c._id === category || c.slug === category)

  const pageTitle =
    activeCategory        ? activeCategory.name :
    gender === 'femme'    ? 'Parfums Femme' :
    gender === 'homme'    ? 'Parfums Homme' :
    gender === 'unisexe'  ? 'Parfums Mixte' :
    featured              ? 'Produits En Vedette' :
    isNew                 ? 'Nouveautés' :
    onPromo               ? 'Promotions' :
    'Tous les Produits'

  const sidebar = (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-title">
        <span>Filtres</span>
        {hasFilters && (
          <button className="filter-clear-btn" onClick={clearFilters}>Tout effacer</button>
        )}
      </div>

      {/* Concentrations */}
      <FilterGroup label="Concentrations" open={openGroups.concentrations} onToggle={() => toggleGroup('concentrations')}>
        <div className="filter-options filter-options-scroll">
          <label className={`filter-option${!concentration ? ' active' : ''}`}>
            <input type="radio" name="concentration" checked={!concentration} onChange={() => setParam('concentration', '')} />
            Toutes
          </label>
          {CONCENTRATIONS.map(c => (
            <label key={c} className={`filter-option${concentration === c ? ' active' : ''}`}>
              <input type="radio" name="concentration" checked={concentration === c} onChange={() => setParam('concentration', c)} />
              {c}
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Genre */}
      <FilterGroup label="Genre" open={openGroups.genre} onToggle={() => toggleGroup('genre')}>
        <div className="filter-options">
          {GENDERS.map(g => (
            <label key={g.value} className={`filter-option${gender === g.value ? ' active' : ''}`}>
              <input
                type="radio"
                name="gender"
                checked={gender === g.value}
                onChange={() => setParam('gender', g.value)}
              />
              {g.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterGroup label="Catégories" open={openGroups.categories} onToggle={() => toggleGroup('categories')}>
          <div className="filter-options">
            <label className={`filter-option${!category ? ' active' : ''}`}>
              <input type="radio" name="category" checked={!category} onChange={() => setParam('category', '')} />
              Toutes
            </label>
            {categories.map(c => (
              <label key={c._id} className={`filter-option${category === c._id ? ' active' : ''}`}>
                <input type="radio" name="category" checked={category === c._id} onChange={() => setParam('category', c._id)} />
                {c.name}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <FilterGroup label="Marques" open={openGroups.marques} onToggle={() => toggleGroup('marques')}>
          {brands.length > 6 && (
            <input
              type="search"
              className="filter-brand-search"
              placeholder="Rechercher une marque..."
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
            />
          )}
          <div className="filter-options filter-options-scroll">
            <label className={`filter-option${!brand ? ' active' : ''}`}>
              <input type="radio" name="brand" checked={!brand} onChange={() => setParam('brand', '')} />
              Toutes
            </label>
            {filteredBrands.map(b => (
              <label key={b._id} className={`filter-option${brand === b._id ? ' active' : ''}`}>
                <input type="radio" name="brand" checked={brand === b._id} onChange={() => setParam('brand', b._id)} />
                {b.name}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Price */}
      <FilterGroup label="Prix (MAD)" open={openGroups.prix} onToggle={() => toggleGroup('prix')}>
        <div className="filter-price-range">
          <input
            type="number"
            className="filter-price-input"
            placeholder="Min"
            value={minPrice}
            min={0}
            onChange={e => setParam('minPrice', e.target.value)}
          />
          <span className="filter-price-sep">—</span>
          <input
            type="number"
            className="filter-price-input"
            placeholder="Max"
            value={maxPrice}
            min={0}
            onChange={e => setParam('maxPrice', e.target.value)}
          />
        </div>
      </FilterGroup>

      {/* Selection */}
      <FilterGroup label="Sélection" open={openGroups.selection} onToggle={() => toggleGroup('selection')}>
        <div className="filter-options">
          <label className="filter-option">
            <input type="checkbox" checked={!!featured} onChange={() => setParam('featured', featured ? '' : 'true')} />
            En vedette
          </label>
          <label className="filter-option">
            <input type="checkbox" checked={!!isNew} onChange={() => setParam('isNew', isNew ? '' : 'true')} />
            Nouveautés
          </label>
          <label className="filter-option">
            <input type="checkbox" checked={!!inStock} onChange={() => setParam('inStock', inStock ? '' : 'true')} />
            En stock uniquement
          </label>
        </div>
      </FilterGroup>
    </aside>
  )

  return (
    <>
      <Seo
        title={pageTitle}
        description={
          gender === 'femme'   ? 'Découvrez notre sélection de parfums femme des plus grandes maisons mondiales. Livraison 48h au Maroc.' :
          gender === 'homme'   ? 'Découvrez notre sélection de parfums homme de luxe. Livraison 48h partout au Maroc.' :
          'Découvrez toute notre gamme de parfums, soins et cosmétiques authentiques. Livraison express 48h au Maroc.'
        }
        keywords={
          gender === 'femme' ? 'parfum femme maroc, eau de parfum femme, parfumerie femme casablanca' :
          gender === 'homme' ? 'parfum homme maroc, eau de parfum homme, parfumerie homme casablanca' :
          'parfums maroc, cosmétiques maroc, soins beauté, parfumerie en ligne'
        }
        canonical={gender ? `https://selective-market.com/produits?gender=${gender}` : 'https://selective-market.com/produits'}
      />

      <div className="products-page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Accueil</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{pageTitle}</span>
          </div>
          <h1 className="products-page-title">{search ? `Résultats pour "${search}"` : pageTitle}</h1>
          <div className="products-count">{total} produit{total !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">

          {/* Mobile filter toggle */}
          <button className="mobile-filter-toggle" onClick={() => setMobileFilterOpen(v => !v)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            Filtres {hasFilters && <span className="mobile-filter-badge" />}
          </button>

          <div className="products-layout">
            {/* Sidebar — always visible on desktop, toggled on mobile */}
            <div className={`filter-sidebar-wrap${mobileFilterOpen ? ' open' : ''}`}>
              {sidebar}
            </div>

            {/* Main */}
            <div>
              <div className="products-toolbar">
                <span className="products-toolbar-count">
                  {total} résultat{total !== 1 ? 's' : ''}
                </span>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="loading-screen"><div className="spinner" /></div>
              ) : products.length === 0 ? (
                <div className="products-empty">
                  <div className="products-empty-icon">🔍</div>
                  <p className="products-empty-text">Aucun produit trouvé</p>
                  <button className="btn btn-outline" onClick={clearFilters}>Effacer les filtres</button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
              )}

              {pages > 1 && (
                <div className="pagination">
                  <button className="pagination-btn" disabled={page <= 1} onClick={() => setParam('page', page - 1)}>‹</button>
                  {(() => {
                    const btns = []
                    const addBtn = n => btns.push(
                      <button key={n} className={`pagination-btn${n === page ? ' active' : ''}`} onClick={() => setParam('page', n)}>{n}</button>
                    )
                    const addEllipsis = k => btns.push(<span key={k} className="pagination-ellipsis">…</span>)
                    addBtn(1)
                    if (page > 4) addEllipsis('s')
                    for (let n = Math.max(2, page - 2); n <= Math.min(pages - 1, page + 2); n++) addBtn(n)
                    if (page < pages - 3) addEllipsis('e')
                    if (pages > 1) addBtn(pages)
                    return btns
                  })()}
                  <button className="pagination-btn" disabled={page >= pages} onClick={() => setParam('page', page + 1)}>›</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
