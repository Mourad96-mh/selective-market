const router = require('express').Router()
const Product = require('../models/Product')
const Category = require('../models/Category')

const SITE_URL = process.env.FRONTEND_URL || 'https://selective-market.com'

function xml(urls) {
  const entries = urls.map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</urlset>`
}

router.get('/', async (_req, res) => {
  try {
    const [products, categories] = await Promise.all([
      Product.find({ stock: { $gte: 0 } }, 'slug updatedAt').lean(),
      Category.find({}, 'slug updatedAt').lean(),
    ])

    const today = new Date().toISOString().split('T')[0]

    const urls = [
      { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0', lastmod: today },
      { loc: `${SITE_URL}/produits`, changefreq: 'daily', priority: '0.9', lastmod: today },
      { loc: `${SITE_URL}/produits?gender=femme`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${SITE_URL}/produits?gender=homme`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${SITE_URL}/a-propos`, changefreq: 'monthly', priority: '0.6' },
      { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
      ...products.filter(p => p.slug).map(p => ({
        loc: `${SITE_URL}/produits/${p.slug}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today,
        changefreq: 'weekly',
        priority: '0.8',
      })),
      ...categories.filter(c => c.slug).map(c => ({
        loc: `${SITE_URL}/produits?category=${c.slug}`,
        lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : today,
        changefreq: 'weekly',
        priority: '0.7',
      })),
    ]

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(xml(urls))
  } catch (err) {
    res.status(500).send('Sitemap error')
  }
})

module.exports = router
