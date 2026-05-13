import { useState, useEffect, useRef } from 'react'
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config'

function CategoryModal({ category, onClose, onSaved, authFetch }) {
  const [form, setForm] = useState({ name: '', description: '', order: 0, image: '', imagePublicId: '', ...category })
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
      setForm(f => ({ ...f, image: data.url, imagePublicId: data.publicId }))
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
      const url = category?._id ? `/categories/${category._id}` : '/categories'
      const method = category?._id ? 'PUT' : 'POST'
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
          <h2 className="modal-title">{category?._id ? 'Modifier' : 'Nouvelle'} Catégorie</h2>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Nom <span className="form-required">*</span></label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Parfums Femme" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Description de la catégorie..." />
            </div>
            <div className="form-group">
              <label className="form-label">Ordre d'affichage</label>
              <input className="form-control" type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Image</label>
              <div className="img-upload-area" onClick={() => fileRef.current.click()}>
                {uploading ? <div style={{ color: 'var(--color-text-muted)' }}>Envoi en cours...</div>
                  : form.image ? <img src={form.image} alt="preview" style={{ height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  : <div style={{ color: 'var(--color-text-muted)' }}>📁 Cliquez pour uploader une image</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
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

export default function AdminCategories() {
  const { authFetch } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/categories`)
      setCategories(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await authFetch(`/categories/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="admin-content">
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Catégories</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>
          <MdAdd /> Nouvelle catégorie
        </button>
      </div>
      <div style={{ padding: 'var(--space-8)' }}>
        <div className="admin-table-wrap">
          {loading ? <div className="loading-screen"><div className="spinner" /></div>
          : categories.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📁</div>
              <p>Aucune catégorie</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Nom</th><th>Ordre</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td>
                      {cat.image ? <img src={cat.image} alt={cat.name} className="admin-table-img" /> : <div className="admin-table-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📁</div>}
                    </td>
                    <td className="admin-table-name">{cat.name}</td>
                    <td>{cat.order}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-edit" onClick={() => setModal(cat)}><MdEdit size={16} /></button>
                        <button className="admin-action-delete" onClick={() => handleDelete(cat._id)}><MdDelete size={16} /></button>
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
        <CategoryModal
          category={modal._id ? modal : null}
          authFetch={authFetch}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </div>
  )
}
