import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdCheckCircle } from 'react-icons/md'
import Seo from '../components/Seo'
// noindex — transactional page, not for indexing
import { useCart } from '../context/CartContext'
import { API_URL, WHATSAPP_NUMBER, formatPrice } from '../config'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  if (items.length === 0 && !success) {
    return (
      <div className="section">
        <div className="container">
          <div className="not-found" style={{ minHeight: '50vh' }}>
            <div style={{ fontSize: '4rem' }}>🛒</div>
            <h2 className="not-found-title">Votre panier est vide</h2>
            <Link to="/produits" className="btn btn-primary">Découvrir nos produits</Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="section">
        <div className="container">
          <div className="order-success">
            <div className="order-success-icon">
              <MdCheckCircle />
            </div>
            <h1 className="section-title">Commande Confirmée !</h1>
            <div className="order-success-number">Commande {success.orderNumber}</div>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, textAlign: 'center' }}>
              Merci pour votre commande, {success.customer.name}. Notre équipe vous contactera au {success.customer.phone} pour confirmer les détails de livraison.
            </p>
            <Link to="/produits" className="btn btn-primary">Continuer mes achats</Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.city || !form.address) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const orderItems = items.map(i => ({
        productId: i._id,
        name: i.name,
        price: i.price,
        discountPrice: i.discountPrice,
        quantity: i.qty,
        image: i.image,
        volume: i.volume,
      }))
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems, customer: { name: form.name, phone: form.phone, city: form.city, address: form.address }, notes: form.notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la commande')

      const itemLines = items.map(i =>
        `• ${i.name}${i.volume ? ` (${i.volume})` : ''} × ${i.qty} — ${formatPrice((i.discountPrice || i.price) * i.qty)}`
      ).join('\n')

      const msg = encodeURIComponent(
        `Bonjour, je souhaite passer une commande :\n\n` +
        `🛒 *Articles*\n${itemLines}\n\n` +
        `💰 *Total : ${formatPrice(totalPrice)}*\n\n` +
        `👤 *Informations de livraison*\n` +
        `Nom : ${form.name}\n` +
        `Téléphone : ${form.phone}\n` +
        `Ville : ${form.city}\n` +
        `Adresse : ${form.address}` +
        (form.notes ? `\n\n📝 Notes : ${form.notes}` : '') +
        `\n\nMerci !`
      )

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
      clearCart()
      setSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Seo title="Finaliser ma commande" noindex={true} />
      <div className="section-sm">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/produits">Produits</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Commander</span>
          </div>

          <h1 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>Finaliser ma Commande</h1>

          <div className="checkout-layout">
            {/* Form */}
            <div className="checkout-form-section">
              <h2 className="checkout-section-title">Vos Informations</h2>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom complet <span className="form-required">*</span></label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone <span className="form-required">*</span></label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+212 6XX XXX XXX" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ville <span className="form-required">*</span></label>
                    <input className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="Casablanca" required />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Adresse complète <span className="form-required">*</span></label>
                    <input className="form-control" name="address" value={form.address} onChange={handleChange} placeholder="Numéro, rue, quartier..." required />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Notes (optionnel)</label>
                    <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Instructions de livraison, parfum alternatif..." rows={3} />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  🚚 <strong>Livraison gratuite</strong> partout au Maroc · Paiement à la livraison
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-5)', justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Traitement...' : 'Confirmer la commande'}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="order-summary-box">
              <h2 className="order-summary-title">Récapitulatif</h2>
              <div className="order-summary-items">
                {items.map(item => (
                  <div key={item._id} className="order-summary-item">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="order-summary-item-img" />
                    ) : (
                      <div className="order-summary-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--color-surface-alt)' }}>🧴</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="order-summary-item-name">{item.name}</div>
                      {item.volume && <div className="order-summary-item-qty">{item.volume}</div>}
                      <div className="order-summary-item-qty">Qté : {item.qty}</div>
                    </div>
                    <div className="order-summary-item-price">
                      {formatPrice((item.discountPrice || item.price) * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total-section">
                <div className="order-total-row">
                  <span>Sous-total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="order-total-row">
                  <span>Livraison</span>
                  <span style={{ color: 'var(--color-success)' }}>Gratuite</span>
                </div>
                <div className="order-grand-total">
                  <span>Total</span>
                  <span className="order-grand-total-amount">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
