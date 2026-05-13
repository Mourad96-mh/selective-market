import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { MdPhone, MdEmail, MdLocationOn } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name"><span>S</span>elective Market</div>
            <p className="footer-desc">
              Votre destination de beauté au Maroc. Nous proposons une sélection exclusive de parfums,
              soins et cosmétiques des plus grandes maisons mondiales.
            </p>
            <div className="footer-social">
              <a href="https://wa.me/212663432716" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Catégories */}
          <div>
            <div className="footer-col-title">Catégories</div>
            <ul className="footer-links">
              <li><Link to="/produits?gender=femme">Parfums Femme</Link></li>
              <li><Link to="/produits?gender=homme">Parfums Homme</Link></li>
              <li><Link to="/produits">Soins & Beauté</Link></li>
              <li><Link to="/produits">Maquillage</Link></li>
              <li><Link to="/produits">Coffrets Cadeaux</Link></li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <div className="footer-col-title">Informations</div>
            <ul className="footer-links">
              <li><Link to="/a-propos">À propos de nous</Link></li>
              <li><Link to="/contact">Contactez-nous</Link></li>
              <li><a href="#">Livraison & Retours</a></li>
              <li><a href="#">Conditions d'utilisation</a></li>
              <li><a href="#">Politique de confidentialité</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdPhone size={14} />
                <a href="tel:+212663432716">+212 663-432716</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaWhatsapp size={13} />
                <a href="https://wa.me/212663432716" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdEmail size={14} />
                <a href="mailto:contact@selective-market.com">contact@selective-market.com</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MdLocationOn size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} Selective Market. Tous droits réservés.
          </div>
          <div className="footer-payments">
            Paiement sécurisé · Livraison Maroc entier
          </div>
          <div className="footer-dev">
            Développé par <a href="https://www.moudevpro.com/" target="_blank" rel="noopener noreferrer">MouDevPro</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
