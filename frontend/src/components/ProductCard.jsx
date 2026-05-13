import { Link } from 'react-router-dom'
import { MdShoppingCart } from 'react-icons/md'
import { useCart } from '../context/CartContext'
import { formatPrice, discountPercent, cloudinaryAuto } from '../config'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const pct       = discountPercent(product.price, product.discountPrice)
  const mainImage = cloudinaryAuto(product.images?.[0])

  function handleAddToCart(e) {
    e.preventDefault()
    addItem({
      _id:          product._id,
      name:         product.name,
      price:        product.price,
      discountPrice: product.discountPrice,
      image:        mainImage,
      volume:       product.volume,
      brand:        product.brand?.name,
    })
  }

  return (
    <Link to={`/produits/${product.slug || product._id}`} className="product-card">

      {/* Image */}
      <div className="product-card-img-wrap">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="product-card-img" loading="lazy" width={400} height={533} />
        ) : (
          <div className="product-card-img product-card-img-placeholder">🧴</div>
        )}

        <div className="product-card-badges">
          {pct > 0 && <span className="badge badge-promo">-{pct}%</span>}
          {product.isNew && <span className="badge badge-new">Nouveau</span>}
          {product.stock === 0 && <span className="badge badge-soldout">Épuisé</span>}
        </div>

        <button className="product-card-cart-btn" onClick={handleAddToCart} title="Ajouter au panier">
          <MdShoppingCart size={16} />
          Ajouter au panier
        </button>
      </div>

      {/* Body */}
      <div className="product-card-body">
        {product.brand?.name && (
          <div className="product-card-brand">{product.brand.name}</div>
        )}

        <div className="product-card-name">{product.name}</div>

        {(product.concentration || product.volume) && (
          <div className="product-card-type">
            {[product.concentration, product.volume].filter(Boolean).join(' · ')}
          </div>
        )}

        <div className="product-card-price">
          <span className="product-price-current">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {pct > 0 && (
            <span className="product-price-original">{formatPrice(product.price)}</span>
          )}
        </div>

        {product.stock === 0 && (
          <div className="product-card-alert">Recevoir une alerte</div>
        )}
      </div>
    </Link>
  )
}
