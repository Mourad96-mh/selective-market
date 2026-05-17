require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

function parseVolumeMl(str = '') {
  const match = str.match(/(\d+(?:[.,]\d+)?)/)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

function scalePrice(basePrice, baseVol, targetVol) {
  return Math.round(basePrice * targetVol / baseVol)
}

const TARGETS = [
  { volume: '30 ml', ml: 30 },
  { volume: '50 ml', ml: 50 },
  { volume: '90 ml', ml: 90 },
]

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connecté\n')

  const products = await Product.find({})
  console.log(`${products.length} produits à traiter\n`)

  let updated = 0
  let skipped = 0

  for (const p of products) {
    const base = p.variants?.[0]
    const baseVolumeStr = base?.volume || p.volume || ''
    const basePrice = base?.price || p.price
    const baseDiscount = base?.discountPrice || p.discountPrice || null
    const baseVol = parseVolumeMl(baseVolumeStr)

    if (!baseVol || !basePrice) {
      console.log(`  ⚠ Ignoré: ${p.name} (volume: "${baseVolumeStr}")`)
      skipped++
      continue
    }

    const variants = TARGETS.map(({ volume, ml }) => ({
      volume,
      price: scalePrice(basePrice, baseVol, ml),
      discountPrice: baseDiscount ? scalePrice(baseDiscount, baseVol, ml) : null,
    }))

    await Product.updateOne({ _id: p._id }, { $set: { variants } })
    console.log(`  ✓ ${p.name} [base ${baseVol}ml @${basePrice}] → 30ml:${variants[0].price} / 50ml:${variants[1].price} / 90ml:${variants[2].price} MAD`)
    updated++
  }

  console.log(`\n══════════════════════════════`)
  console.log(`${updated} produits mis à jour, ${skipped} ignorés`)
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
