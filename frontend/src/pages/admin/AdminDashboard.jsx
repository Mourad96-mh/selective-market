import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdInventory, MdShoppingBag, MdAttachMoney, MdSchedule } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, STATUS_LABELS, STATUS_COLORS } from '../../config'

export default function AdminDashboard() {
  const { authFetch } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch('/orders/stats/summary')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [authFetch])

  const cards = stats ? [
    { icon: MdInventory, label: 'Produits', value: stats.totalProducts, cls: 'stat-icon-gold', link: '/admin/produits' },
    { icon: MdShoppingBag, label: 'Commandes', value: stats.totalOrders, cls: 'stat-icon-blue', link: '/admin/commandes' },
    { icon: MdSchedule, label: 'En attente', value: stats.pendingOrders, cls: 'stat-icon-purple', link: '/admin/commandes?status=pending' },
    { icon: MdAttachMoney, label: 'Revenus (livrées)', value: formatPrice(stats.revenue), cls: 'stat-icon-green', link: '/admin/commandes' },
  ] : []

  return (
    <div className="admin-content">
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Tableau de bord</h1>
      </div>
      <div className="admin-page-body">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <>
            <div className="stat-cards">
              {cards.map(({ icon: Icon, label, value, cls, link }) => (
                <Link key={label} to={link} className="stat-card" style={{ textDecoration: 'none' }}>
                  <div className={`stat-card-icon ${cls}`}><Icon /></div>
                  <div>
                    <div className="stat-card-value">{value}</div>
                    <div className="stat-card-label">{label}</div>
                  </div>
                </Link>
              ))}
            </div>

            {stats?.recentOrders?.length > 0 && (
              <div className="admin-table-wrap">
                <div className="admin-table-header">
                  <h2 className="admin-table-title">Commandes Récentes</h2>
                  <Link to="/admin/commandes" className="btn btn-sm btn-outline">Voir tout</Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Client</th>
                      <th>Téléphone</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map(order => (
                      <tr key={order._id}>
                        <td><strong>{order.orderNumber}</strong></td>
                        <td>{order.customer?.name}</td>
                        <td>{order.customer?.phone}</td>
                        <td>{formatPrice(order.total)}</td>
                        <td>
                          <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('fr-MA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
