import { useState, useEffect, useRef } from 'react'
import { MdAdd, MdEdit, MdDelete, MdClose, MdSearch } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { API_URL, formatPrice } from '../../config'

const GENDER_OPTIONS = [
  { value: 'unisexe', label: 'Unisexe' },
  { value: 'femme', label: 'Femme' },
  { value: 'homme', label: 'Homme' },
]

const VOLUME_OPTIONS = [
  '', '30 ml', '50 ml', '90 ml', 'Échantillon 1-2 ml',
]

const CONCENTRATION_OPTIONS = [
  '', 'Eau de Cologne', 'Eau de Toilette', 'Eau de Parfum',
  'Eau de Parfum Intense', 'Eau de Parfum Absolute', 'Eau de Parfum Fruitée',
  'Extrait de Parfum', 'Parfum Elixir', 'Parfum de peau',
  'Eau Fraîche', 'Eau Intense', 'Parfum',
]

function ProductModal({ product, categories, brands, onClose, onSaved, authFetch }) {
  const isEdit = !!product?._id
  const [form, setForm] = useState({
    name: '', description: '', stock: 0,
    gender: 'unisexe', concentration: '', volume: '', featured: false, isNew: false,
    images: [], imagePublicIds: [],
    ...product,
    price: product?.price ?? '',
    discountPrice: product?.discountPrice ?? '',
    category: product?.category?._id || product?.category || '',
    brand: product?.brand?._id || product?.brand || '',
    tags: product?.tags?.join(', ') || '',
    variants: product?.variants || [],
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  async function uploadImage(file) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await authFetch('/upload', { method: 'POST', headers: {}, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setForm(f => ({
        ...f,
        images: [...f.images, data.url],
        imagePublicIds: [...f.imagePublicIds, data.publicId],
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  function removeImage(idx) {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
      imagePublicIds: f.imagePublicIds.filter((_, i) => i !== idx),
    }))
  }

  function addVariantRow() {
    setForm(f => ({ ...f, variants: [...f.variants, { volume: '', price: '', discountPrice: '' }] }))
  }

  function updateVariant(idx, field, val) {
    setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === idx ? { ...v, [field]: val } : v) }))
  }

  function removeVariant(idx) {
    setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }))
  }

  async function handleSave() {
    const cleanVariants = form.variants
      .filter(v => v.volume && v.price)
      .map(v => ({ volume: v.volume, price: Number(v.price), discountPrice: v.discountPrice ? Number(v.discountPrice) : null }))
    const hasVariants = cleanVariants.length > 0
    if (!form.name.trim() || !form.category || !form.brand || !form.description.trim()) {
      return setError('Nom, description, catégorie et marque sont requis')
    }
    if (!hasVariants && !form.price) {
      return setError('Ajoutez un prix ou au moins une contenance avec son prix')
    }
    setSaving(true)
    setError('')
    try {
      const basePrice = hasVariants ? Math.min(...cleanVariants.map(v => v.price)) : Number(form.price)
      const payload = {
        ...form,
        price: basePrice,
        discountPrice: hasVariants ? null : (form.discountPrice ? Number(form.discountPrice) : null),
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        variants: cleanVariants,
      }
      const url = isEdit ? `/products/${product._id}` : '/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await authFetch(url, { method, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 780 }}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Modifier' : 'Nouveau'} Produit</h2>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="admin-form-grid">
            <div className="form-group full">
              <label className="form-label">Nom du produit <span className="form-required">*</span></label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Bleu de Chanel Eau de Parfum" />
            </div>
            <div className="form-group full">
              <label className="form-label">Description <span className="form-required">*</span></label>
              <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Description détaillée du produit..." />
            </div>
            {form.variants.filter(v => v.volume && v.price).length === 0 && (<>
            <div className="form-group">
              <label className="form-label">Prix (MAD) <span className="form-required">*</span></label>
              <input className="form-control" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Prix promo (MAD)</label>
              <input className="form-control" type="number" min="0" step="0.01" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} placeholder="Laisser vide si pas de promo" />
            </div>
            </>)}
            <div className="form-group">
              <label className="form-label">Catégorie <span className="form-required">*</span></label>
              <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">-- Choisir --</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Marque <span className="form-required">*</span></label>
              <select className="form-control" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}>
                <option value="">-- Choisir --</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-control" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                {GENDER_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Concentration</label>
              <select className="form-control" value={form.concentration} onChange={e => setForm(f => ({ ...f, concentration: e.target.value }))}>
                {CONCENTRATION_OPTIONS.map(c => <option key={c} value={c}>{c || '-- Aucune --'}</option>)}
              </select>
            </div>
            <div className="form-group full" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Contenances & Prix</label>
              {form.variants.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  {form.variants.map((v, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <input
                        className="form-control"
                        style={{ flex: '0 0 160px' }}
                        list="volume-options"
                        placeholder="Ex: 100 ml"
                        value={v.volume}
                        onChange={e => updateVariant(idx, 'volume', e.target.value)}
                      />
                      <input className="form-control" type="number" min="0" placeholder="Prix (MAD)" value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} />
                      <input className="form-control" type="number" min="0" placeholder="Promo (MAD)" value={v.discountPrice} onChange={e => updateVariant(idx, 'discountPrice', e.target.value)} />
                      <button type="button" onClick={() => removeVariant(idx)} style={{ flexShrink: 0, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={addVariantRow}>+ Ajouter une contenance</button>
              <datalist id="volume-options">
                {VOLUME_OPTIONS.filter(Boolean).map(opt => <option key={opt} value={opt} />)}
              </datalist>
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input className="form-control" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (séparés par virgule)</label>
              <input className="form-control" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="oriental, boisé, floral..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-3)' }}>
              <label className="toggle-label">
                <input className="toggle-input" type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <div className="toggle-track"><div className="toggle-thumb" /></div>
                Coup de cœur
              </label>
              <label className="toggle-label">
                <input className="toggle-input" type="checkbox" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))} />
                <div className="toggle-track"><div className="toggle-thumb" /></div>
                Nouveauté
              </label>
            </div>
            <div className="form-group full">
              <label className="form-label">Images du produit</label>
              <div className="img-upload-area" onClick={() => fileRef.current.click()}>
                {uploading ? <div style={{ color: 'var(--color-text-muted)' }}>Envoi en cours...</div>
                  : <div style={{ color: 'var(--color-text-muted)' }}>📁 Cliquez pour ajouter une image</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
              {form.images.length > 0 && (
                <div className="img-upload-preview">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="img-preview-item">
                      <img src={url} alt={`img-${idx}`} />
                      <button className="img-preview-remove" onClick={() => removeImage(idx)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || uploading}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { authFetch } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  async function load(p = page, s = search) {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 15 })
      if (s) params.set('search', s)
      const res = await fetch(`${API_URL}/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/categories`).then(r => r.json()),
      fetch(`${API_URL}/brands`).then(r => r.json()),
    ]).then(([c, b]) => {
      setCategories(c || [])
      setBrands(b || [])
    })
  }, [])

  useEffect(() => { load() }, [page])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    load(1, search)
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await authFetch(`/products/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="admin-content">
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Produits ({total})</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <MdAdd /> Nouveau produit
        </button>
      </div>
      <div style={{ padding: 'var(--space-8)' }}>
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Liste des produits</h2>
            <div className="admin-table-controls">
              <form className="admin-search" onSubmit={handleSearch}>
                <MdSearch className="admin-search-icon" size={16} />
                <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
              </form>
            </div>
          </div>

          {loading ? <div className="loading-screen"><div className="spinner" /></div>
          : products.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🧴</div>
              <p>Aucun produit</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Nom</th><th>Marque</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="admin-table-img" />
                        : <div className="admin-table-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--color-surface-alt)' }}>🧴</div>}
                    </td>
                    <td>
                      <div className="admin-table-name">{p.name}</div>
                      <div style={{ display: 'flex', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                        {p.featured && <span className="badge badge-promo" style={{ fontSize: '0.6rem' }}>★</span>}
                        {p.isNew && <span className="badge badge-new" style={{ fontSize: '0.6rem' }}>Nouveau</span>}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{p.brand?.name || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{p.category?.name || '—'}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{formatPrice(p.discountPrice || p.price)}</div>
                      {p.discountPrice && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>{formatPrice(p.price)}</div>}
                    </td>
                    <td>
                      <span style={{ color: p.stock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 500 }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-edit" onClick={() => setModal(p)}><MdEdit size={16} /></button>
                        <button className="admin-action-delete" onClick={() => handleDelete(p._id)}><MdDelete size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div className="pagination" style={{ padding: 'var(--space-5)' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} className={`pagination-btn${n === page ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal !== null && (
        <ProductModal
          product={modal._id ? modal : null}
          categories={categories}
          brands={brands}
          authFetch={authFetch}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
