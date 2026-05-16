import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MdShoppingCart, MdAdd, MdRemove } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../components/Seo'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { API_URL, WHATSAPP_NUMBER, formatPrice, discountPercent, GENDER_LABELS, cloudinaryAuto } from '../config'

const SITE_URL = 'https://selective-market.com'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    setQty(1)
    fetch(`${API_URL}/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        setSelectedVariant(data.variants?.length ? data.variants[0] : null)
        if (data.category?._id) {
          fetch(`${API_URL}/products?category=${data.category._id}&limit=4`)
            .then(r => r.json())
            .then(rd => setRelated((rd.products || []).filter(p => p._id !== data._id).slice(0, 4)))
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  function handleAddToCart() {
    if (!product) return
    const price = selectedVariant ? selectedVariant.price : product.price
    const discountPrice = selectedVariant ? selectedVariant.discountPrice : product.discountPrice
    const volume = selectedVariant ? selectedVariant.volume : product.volume
    const cartKey = selectedVariant ? `${product._id}:${selectedVariant.volume}` : product._id
    addItem({ _id: product._id, cartKey, name: product.name, price, discountPrice, image: product.images?.[0], volume, brand: product.brand?.name, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleWhatsApp() {
    const price = selectedVariant
      ? formatPrice(selectedVariant.discountPrice || selectedVariant.price)
      : formatPrice(product.discountPrice || product.price)
    const volume = selectedVariant ? selectedVariant.volume : product.volume
    const msg = encodeURIComponent(
      `Bonjour, je souhaite commander:\n\n*${product.name}*${volume ? ` (${volume})` : ''}\nQuantité: ${qty}\nPrix: ${price}\n\nMerci`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  if (!product) return (
    <div className="section">
      <div className="container not-found">
        <div className="not-found-number">404</div>
        <h1 className="not-found-title">Produit introuvable</h1>
        <Link to="/produits" className="btn btn-primary">Retour aux produits</Link>
      </div>
    </div>
  )

  const activePrice = selectedVariant ? selectedVariant.price : product.price
  const activeDiscount = selectedVariant ? selectedVariant.discountPrice : product.discountPrice
  const pct = discountPercent(activePrice, activeDiscount)
  const images = (product.images?.length ? product.images : []).map(cloudinaryAuto)

  return (
    <>
      <Seo
        title={`${product.name}${product.brand?.name ? ` — ${product.brand.name}` : ''}`}
        description={product.description?.slice(0, 160)}
        image={images[0]}
        type="product"
        keywords={[product.name, product.brand?.name, product.category?.name, 'parfum maroc', 'acheter parfum maroc'].filter(Boolean).join(', ')}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: images,
            brand: product.brand?.name ? { '@type': 'Brand', name: product.brand.name } : undefined,
            offers: {
              '@type': 'Offer',
              price: product.discountPrice || product.price,
              priceCurrency: 'MAD',
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `${SITE_URL}/produits/${product.slug}`,
              seller: { '@type': 'Organization', name: 'Selective Market' },
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Produits', item: `${SITE_URL}/produits` },
              ...(product.category ? [{ '@type': 'ListItem', position: 3, name: product.category.name, item: `${SITE_URL}/produits?category=${product.category.slug}` }] : []),
              { '@type': 'ListItem', position: product.category ? 4 : 3, name: product.name, item: `${SITE_URL}/produits/${product.slug}` },
            ],
          },
        ],
      })}} />

      <section className="section-sm">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/produits">Produits</Link>
            {product.category && (
              <>
                <span className="breadcrumb-sep">/</span>
                <Link to={`/produits?category=${product.category.slug}`}>{product.category.name}</Link>
              </>
            )}
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          <div className="product-detail-layout">
            {/* Gallery */}
            <div className="product-gallery">
              <div className="product-gallery-main">
                {images[activeImg] ? (
                  <img src={images[activeImg]} alt={product.name} width={600} height={800} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🧴</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="product-gallery-thumbs">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className={`product-gallery-thumb${i === activeImg ? ' active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-info">
              {product.brand?.name && (
                <div className="product-info-brand">{product.brand.name}</div>
              )}
              <h1 className="product-info-name">{product.name}</h1>

              <div className="product-info-meta">
                {product.volume && <span className="product-info-tag">📦 {product.volume}</span>}
                {product.gender && product.gender !== 'unisexe' && (
                  <span className="product-info-tag">{GENDER_LABELS[product.gender]}</span>
                )}
                {product.category?.name && (
                  <span className="product-info-tag">{product.category.name}</span>
                )}
                {product.isNew && <span className="badge badge-new">Nouveau</span>}
              </div>

              <div className="product-info-price">
                <span className="product-info-price-current">
                  {formatPrice(activeDiscount || activePrice)}
                </span>
                {pct > 0 && (
                  <>
                    <span className="product-info-price-original">{formatPrice(activePrice)}</span>
                    <span className="product-info-price-save">-{pct}%</span>
                  </>
                )}
              </div>

              {product.variants?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-4)', maxWidth: 220 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text-muted)' }}>Contenance</p>
                  <select
                    className="form-control"
                    value={selectedVariant?.volume || ''}
                    onChange={e => setSelectedVariant(product.variants.find(v => v.volume === e.target.value))}
                  >
                    {product.variants.map(v => (
                      <option key={v.volume} value={v.volume}>{v.volume}</option>
                    ))}
                  </select>
                </div>
              )}

              <p className="product-info-description">{product.description}</p>

              <div className="product-qty-row">
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Quantité</label>
                <div className="qty-control-lg">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <MdRemove />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => q + 1)}>
                    <MdAdd />
                  </button>
                </div>
              </div>

              <div className="product-cta-row">
                <button
                  className={`btn${added ? ' btn-gold' : ' btn-primary'}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <MdShoppingCart />
                  {added ? 'Ajouté !' : product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
                </button>
                <button className="btn btn-outline" onClick={handleWhatsApp} style={{ background: 'transparent', borderColor: '#25d366', color: '#25d366' }}>
                  <FaWhatsapp />
                  Commander via WhatsApp
                </button>
              </div>

              <div className="product-stock-indicator">
                <div className={`stock-dot ${product.stock > 0 ? 'in' : 'out'}`} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Vous Aimerez Aussi</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Produits Similaires</h2>
            </div>
            <div className="grid-4">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
