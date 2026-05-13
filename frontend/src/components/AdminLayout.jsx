import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard, MdCategory, MdStorefront, MdInventory,
  MdShoppingBag, MdSettings, MdLogout, MdMenu, MdClose
} from 'react-icons/md'

const navItems = [
  { to: '/admin', label: 'Tableau de bord', icon: MdDashboard, end: true },
  { to: '/admin/categories', label: 'Catégories', icon: MdCategory },
  { to: '/admin/marques', label: 'Marques', icon: MdStorefront },
  { to: '/admin/produits', label: 'Produits', icon: MdInventory },
  { to: '/admin/commandes', label: 'Commandes', icon: MdShoppingBag },
  { to: '/admin/parametres', label: 'Paramètres', icon: MdSettings },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-app">
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-text">
            <span>S</span>elective Market
          </div>
          <div className="admin-sidebar-sub">Administration</div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-label">Menu</div>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <MdLogout />
            Déconnexion
          </button>
        </div>
      </aside>

      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(v => !v)}
        aria-label="Menu"
      >
        {sidebarOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
      </button>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}
