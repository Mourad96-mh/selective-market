require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connecté\n')

  // Find products with no variants but with a volume and price set
  const products = await Product.find({
    $or: [{ variants: { $size: 0 } }, { variants: { $exists: false } }],
    volume: { $nin: ['', null] },
  })

  console.log(`${products.length} produits sans variants trouvés\n`)

  let updated = 0
  let skipped = 0

  for (const p of products) {
    if (!p.price) { skipped++; continue }

    p.variants = [{
      volume: p.volume,
      price: p.price,
      discountPrice: p.discountPrice || null,
    }]

    await p.save()
    console.log(`  ✓ ${p.name} — ${p.volume} à ${p.price} MAD`)
    updated++
  }

  console.log(`\n══════════════════════════════`)
  console.log(`${updated} produits mis à jour, ${skipped} ignorés (pas de prix)`)
  await mongoose.disconnect()
}

migrate().catch(err => { console.error(err); process.exit(1) })
