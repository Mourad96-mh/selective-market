import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminSettings() {
  const { authFetch } = useAuth()
  const [form, setForm] = useState({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.currentPassword) return setError('Le mot de passe actuel est requis')
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      return setError('Les nouveaux mots de passe ne correspondent pas')
    }

    setLoading(true)
    try {
      const payload = { currentPassword: form.currentPassword }
      if (form.email) payload.email = form.email
      if (form.newPassword) payload.newPassword = form.newPassword

      const res = await authFetch('/auth/credentials', { method: 'PUT', body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSuccess('Identifiants mis à jour avec succès.')
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Paramètres</h1>
      </div>
      <div style={{ padding: 'var(--space-8)' }}>
        <div className="admin-form-page">
          <div className="admin-form-card">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, marginBottom: 'var(--space-6)' }}>
              Modifier les identifiants
            </h2>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Nouvel email (laisser vide pour ne pas changer)</label>
                <input
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="nouveau@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe actuel <span className="form-required">*</span></label>
                <input
                  className="form-control"
                  type="password"
                  value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                <input
                  className="form-control"
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le nouveau mot de passe</label>
                <input
                  className="form-control"
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
