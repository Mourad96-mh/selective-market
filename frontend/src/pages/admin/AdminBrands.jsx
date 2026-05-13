import { useState, useEffect, useRef } from 'react'
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config'

function BrandModal({ brand, onClose, onSaved, authFetch }) {
  const [form, setForm] = useState({ name: '', description: '', featured: false, logo: '', logoPublicId: '', ...brand })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  async function uploadLogo(file) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await authFetch('/upload', { method: 'POST', headers: {}, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setForm(f => ({ ...f, logo: data.url, logoPublicId: data.publicId }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return setError('Le nom est requis')
    setSaving(true)
    setError('')
    try {
      const url = brand?._id ? `/brands/${brand._id}` : '/brands'
      const method = brand?._id ? 'PUT' : 'POST'
      const res = await authFetch(url, { method, body: JSON.stringify(form) })
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
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{brand?._id ? 'Modifier' : 'Nouvelle'} Marque</h2>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Nom <span className="form-required">*</span></label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Chanel" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Description de la marque..." />
            </div>
            <label className="toggle-label">
              <input className="toggle-input" type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              <div className="toggle-track"><div className="toggle-thumb" /></div>
              Marque vedette (affichée sur l'accueil)
            </label>
            <div className="form-group">
              <label className="form-label">Logo</label>
              <div className="img-upload-area" onClick={() => fileRef.current.click()}>
                {uploading ? <div style={{ color: 'var(--color-text-muted)' }}>Envoi en cours...</div>
                  : form.logo ? <img src={form.logo} alt="logo" style={{ height: 80, objectFit: 'contain' }} />
                  : <div style={{ color: 'var(--color-text-muted)' }}>📁 Cliquez pour uploader le logo</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && uploadLogo(e.target.files[0])} />
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

export default function AdminBrands() {
  const { authFetch } = useAuth()
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/brands`)
      setBrands(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer cette marque ?')) return
    await authFetch(`/brands/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="admin-content">
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Marques</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <MdAdd /> Nouvelle marque
        </button>
      </div>
      <div style={{ padding: 'var(--space-8)' }}>
        <div className="admin-table-wrap">
          {loading ? <div className="loading-screen"><div className="spinner" /></div>
          : brands.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🏷️</div>
              <p>Aucune marque</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Logo</th><th>Nom</th><th>Vedette</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {brands.map(brand => (
                  <tr key={brand._id}>
                    <td>
                      {brand.logo
                        ? <img src={brand.logo} alt={brand.name} className="admin-table-logo" />
                        : <div className="admin-table-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)' }}>🏷️</div>}
                    </td>
                    <td className="admin-table-name">{brand.name}</td>
                    <td>{brand.featured ? '⭐ Oui' : '—'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-edit" onClick={() => setModal(brand)}><MdEdit size={16} /></button>
                        <button className="admin-action-delete" onClick={() => handleDelete(brand._id)}><MdDelete size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal !== null && (
        <BrandModal
          brand={modal._id ? modal : null}
          authFetch={authFetch}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
