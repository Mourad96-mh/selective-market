import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Selective Market'
const SITE_URL = 'https://selective-market.com'
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&h=630&auto=format&fit=crop&q=80'
const DEFAULT_KEYWORDS = 'parfum maroc, cosmétiques maroc, parfumerie en ligne, soins beauté maroc, livraison maroc'

export default function Seo({ title, description, image, type = 'website', keywords, noindex = false, canonical: canonicalOverride }) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} | Parfums, Soins & Cosmétiques au Maroc`
  const canonical = canonicalOverride || `${SITE_URL}${pathname}`
  const ogImage = image || DEFAULT_IMAGE
  const metaDescription = description || 'Votre parfumerie en ligne au Maroc. Parfums, soins et cosmétiques des plus grandes marques. Livraison 48h partout au Maroc.'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fr_MA" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
