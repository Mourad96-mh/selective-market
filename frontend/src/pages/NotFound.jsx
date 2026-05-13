import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page introuvable" />
      <div className="not-found">
        <div className="not-found-number">404</div>
        <h1 className="not-found-title">Page Introuvable</h1>
        <p className="not-found-text">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    </>
  )
}
