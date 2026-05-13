import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MdClose, MdShoppingCart, MdAdd, MdRemove } from 'react-icons/md'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../config'

let openCartDrawer = null

export function openCart() {
  if (openCartDrawer) openCartDrawer()
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart()

  useEffect(() => {
    openCartDrawer = () => setOpen(true)
    return () => { openCartDrawer = null }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`cart-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            Panier {totalItems > 0 && <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>({totalItems})</span>}
          </h2>
          <button className="cart-drawer-close" onClick={() => setOpen(false)}>
            <MdClose size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <MdShoppingCart className="cart-empty-icon" />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Votre panier est vide</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>Ajoutez des produits pour commencer</p>
              <button className="btn btn-outline" onClick={() => setOpen(false)}>
                Continuer mes achats
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="cart-item">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                ) : (
                  <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--color-surface-alt)' }}>
                    🧴
                  </div>
                )}
                <div className="cart-item-info">
                  {item.brand && <div className="cart-item-brand">{item.brand}</div>}
                  <div className="cart-item-name">{item.name}</div>
                  {item.volume && <div className="cart-item-volume">{item.volume}</div>}
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>
                        <MdRemove size={14} />
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>
                        <MdAdd size={14} />
                      </button>
                    </div>
                    <span className="cart-item-price">
                      {formatPrice((item.discountPrice || item.price) * item.qty)}
                    </span>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(item._id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Sous-total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Livraison</span>
                <span style={{ color: 'var(--color-success)' }}>Gratuite</span>
              </div>
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span className="cart-total-amount">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-4)', justifyContent: 'center' }}
              onClick={() => setOpen(false)}
            >
              Passer la commande
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
