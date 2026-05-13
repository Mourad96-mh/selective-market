import { useState, useEffect } from 'react'
import { MdSearch, MdClose, MdVisibility } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, STATUS_LABELS, STATUS_COLORS } from '../../config'

const STATUSES = [
  { value: '', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
]

function OrderDetailModal({ order, onClose, onStatusChange, authFetch }) {
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)

  async function handleStatusChange(newStatus) {
    setSaving(true)
    try {
      await authFetch(`/orders/${order._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
      setStatus(newStatus)
      onStatusChange(order._id, newStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2 className="modal-title">Commande {order.orderNumber}</h2>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <div className="order-info-card">
              <div className="order-info-card-title">Client</div>
              {[
                ['Nom', order.customer?.name],
                ['Téléphone', order.customer?.phone],
                ['Ville', order.customer?.city],
                ['Adresse', order.customer?.address],
              ].map(([k, v]) => (
                <div key={k} className="order-info-row">
                  <span className="order-info-key">{k}</span>
                  <span className="order-info-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="order-info-card">
              <div className="order-info-card-title">Commande</div>
              {[
                ['N°', order.orderNumber],
                ['Date', new Date(order.createdAt).toLocaleDateString('fr-MA')],
                ['Total', formatPrice(order.total)],
              ].map(([k, v]) => (
                <div key={k} className="order-info-row">
                  <span className="order-info-key">{k}</span>
                  <span className="order-info-val">{v}</span>
                </div>
              ))}
              <div className="order-info-row">
                <span className="order-info-key">Statut</span>
                <span className={`status-badge ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div style={{ background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <strong>Notes :</strong> {order.notes}
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: '0.875rem' }}>Articles commandés</div>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  {item.volume && <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.volume}</div>}
                  <div style={{ color: 'var(--color-text-muted)' }}>Qté : {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 500 }}>{formatPrice((item.discountPrice || item.price) * item.quantity)}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4) 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500 }}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: '0.875rem' }}>Changer le statut</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  className={`btn btn-sm${status === val ? ' btn-primary' : ' btn-ghost'}`}
                  onClick={() => handleStatusChange(val)}
                  disabled={saving || status === val}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const { authFetch } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)
  const statusFilter = searchParams.get('status') || ''
  const page = Number(searchParams.get('page') || 1)

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await authFetch(`/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter, page])

  function handleStatusUpdate(id, newStatus) {
    setOrders(os => os.map(o => o._id === id ? { ...o, status: newStatus } : o))
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette commande ?')) return
    await authFetch(`/orders/${id}`, { method: 'DELETE' })
    load()
  }

  function setParam(key, val) {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  return (
    <div className="admin-content">
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Commandes ({total})</h1>
      </div>
      <div style={{ padding: 'var(--space-8)' }}>
        {/* Status filters */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button
              key={s.value}
              className={`btn btn-sm${statusFilter === s.value ? ' btn-primary' : ' btn-ghost'}`}
              onClick={() => setParam('status', s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <h2 className="admin-table-title">Liste des commandes</h2>
            <form className="admin-search" onSubmit={e => { e.preventDefault(); load() }}>
              <MdSearch className="admin-search-icon" size={16} />
              <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </form>
          </div>

          {loading ? <div className="loading-screen"><div className="spinner" /></div>
          : orders.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📦</div>
              <p>Aucune commande</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>N°</th><th>Client</th><th>Téléphone</th><th>Ville</th><th>Total</th><th>Statut</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td className="admin-table-name">{order.customer?.name}</td>
                    <td>{order.customer?.phone}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{order.customer?.city}</td>
                    <td style={{ fontWeight: 500 }}>{formatPrice(order.total)}</td>
                    <td>
                      <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-edit" onClick={() => setDetail(order)} title="Voir détails">
                          <MdVisibility size={16} />
                        </button>
                        <button className="admin-action-delete" onClick={() => handleDelete(order._id)} title="Supprimer">
                          ✕
                        </button>
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
                <button key={n} className={`pagination-btn${n === page ? ' active' : ''}`} onClick={() => setParam('page', n)}>{n}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {detail && (
        <OrderDetailModal
          order={detail}
          authFetch={authFetch}
          onClose={() => setDetail(null)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  )
}
