require('dotenv').config()
const https = require('https')
const mongoose = require('mongoose')
const Product  = require('./models/Product')
const Brand    = require('./models/Brand')
const Category = require('./models/Category')

/* ─── Collections to import ───────────────────────────────── */
const COLLECTIONS = [
  { slug: 'parfum',        categoryName: 'Parfum' },
  { slug: 'maquillage',    categoryName: 'Maquillage' },
  { slug: 'soin-visage',   categoryName: 'Soin Visage' },
  { slug: 'corps-et-bain', categoryName: 'Corps & Bain' },
  { slug: 'homme',         categoryName: 'Homme' },
  { slug: 'cheveux',       categoryName: 'Cheveux' },
  { slug: 'accessoires',   categoryName: 'Accessoires' },
]

/* ─── Helpers ─────────────────────────────────────────────── */
function stripHtml(str = '') {
  return str.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/* Replace the source competitor's name with our store name. */
function rebrand(str = '') {
  return str.replace(/kosmenia/gi, 'Selective Market')
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const opts = { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    https.get(url, opts, res => {
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) } catch (e) { resolve({ products: [] }) }
      })
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function parseGender(productType = '', tags = []) {
  const t = (productType + ' ' + tags.join(' ')).toLowerCase()
  if (t.includes('femme'))  return 'femme'
  if (t.includes('homme'))  return 'homme'
  return 'unisexe'
}

function parseBrandFromTags(tags = []) {
  const tag = tags.find(t => t.startsWith('Marques_'))
  return tag ? tag.replace('Marques_', '').trim() : null
}

function parseConcentrationFromTags(tags = []) {
  const tag = tags.find(t => t.startsWith('Concentrations_'))
  return tag ? tag.replace('Concentrations_', '').trim() : ''
}

/* ─── Main ────────────────────────────────────────────────── */
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connecté\n')

  /* Cache of brand name → ObjectId */
  const brandCache = {}
  const allBrands = await Brand.find({}, 'name _id')
  for (const b of allBrands) brandCache[b.name.toLowerCase()] = b._id

  async function getBrandId(name) {
    if (!name) return null
    const key = name.toLowerCase()
    if (brandCache[key]) return brandCache[key]
    /* Create missing brand on the fly */
    const created = await Brand.create({ name })
    brandCache[key] = created._id
    console.log(`  + Nouvelle marque : ${name}`)
    return created._id
  }

  /* Cache of category name → ObjectId */
  const catCache = {}
  async function getCategoryId(name) {
    if (catCache[name]) return catCache[name]
    let cat = await Category.findOne({ name })
    if (!cat) cat = await Category.create({ name })
    catCache[name] = cat._id
    return cat._id
  }

  let totalAdded = 0
  let totalSkipped = 0

  for (const { slug, categoryName } of COLLECTIONS) {
    const categoryId = await getCategoryId(categoryName)
    let page = 1
    let collectionAdded = 0
    let collectionSkipped = 0

    console.log(`\n═══ ${categoryName} (/collections/${slug}) ═══`)

    while (true) {
      const url = `https://kosmenia.ma/collections/${slug}/products.json?limit=250&page=${page}`
      const data = await fetchJson(url)
      const products = data.products || []

      if (products.length === 0) break

      for (const p of products) {
        const name = rebrand(stripHtml(p.title))
        if (!name) { collectionSkipped++; continue }

        /* Skip if already in DB */
        const exists = await Product.findOne({ slug: p.handle })
        if (exists) { collectionSkipped++; continue }

        /* Brand from tags */
        const brandName = parseBrandFromTags(p.tags)
        const brandId   = await getBrandId(brandName)

        /* Concentration from tags */
        const concentration = parseConcentrationFromTags(p.tags)

        /* Gender from product_type + tags */
        const gender = parseGender(p.product_type, p.tags)

        /* First available variant */
        const variant = p.variants?.find(v => v.available) || p.variants?.[0]
        if (!variant) { collectionSkipped++; continue }

        const price         = parseFloat(variant.compare_at_price || variant.price)
        const discountPrice = variant.compare_at_price ? parseFloat(variant.price) : null
        const volume        = variant.option1 !== 'Default Title' ? variant.option1 : ''
        const stock         = variant.available ? 10 : 0

        /* Description */
        const description = rebrand(stripHtml(p.body_html)) || `${name} — ${brandName || categoryName}`

        /* Images */
        const images = (p.images || []).map(i => i.src).slice(0, 4)

        try {
          await Product.create({
            name,
            slug: p.handle,
            description: description.slice(0, 2000),
            price,
            discountPrice,
            category: categoryId,
            brand: brandId,
            concentration,
            gender,
            volume,
            stock,
            images,
            featured: false,
            isNew: false,
            tags: (p.tags || []).map(rebrand),
          })
          process.stdout.write('.')
          collectionAdded++
        } catch {
          collectionSkipped++
        }
      }

      console.log(`\n  Page ${page}: ${products.length} produits traités`)
      if (products.length < 250) break
      page++
      await sleep(400) /* Be polite to their server */
    }

    console.log(`  ✓ ${collectionAdded} ajoutés, ${collectionSkipped} ignorés`)
    totalAdded   += collectionAdded
    totalSkipped += collectionSkipped
  }

  console.log(`\n══════════════════════════════`)
  console.log(`Total : ${totalAdded} produits ajoutés, ${totalSkipped} ignorés`)
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
