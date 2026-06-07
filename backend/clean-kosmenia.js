require('dotenv').config()
const mongoose = require('mongoose')
const Product  = require('./models/Product')

/* Replace every mention of the competitor's name with our store name. */
const FIND    = 'kosmenia'                  // case-insensitive match
const REPLACE = 'Selective Market'
const has     = s => typeof s === 'string' && s.toLowerCase().includes(FIND)
const swap    = s => s.replace(/kosmenia/gi, REPLACE)

async function clean() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connecté\n')

  const products = await Product.find({
    $or: [
      { description: { $regex: FIND, $options: 'i' } },
      { tags:        { $regex: FIND, $options: 'i' } },
    ],
  })

  console.log(`${products.length} produit(s) à nettoyer\n`)

  let updated = 0
  for (const p of products) {
    let changed = false

    if (has(p.description)) {
      p.description = swap(p.description).replace(/\s+/g, ' ').trim()
      changed = true
    }

    if (Array.isArray(p.tags) && p.tags.some(has)) {
      p.tags = p.tags.map(swap)
      changed = true
    }

    if (changed) {
      await p.save()
      process.stdout.write('.')
      updated++
    }
  }

  console.log(`\n\n✓ ${updated} produit(s) mis à jour`)
  await mongoose.disconnect()
}

clean().catch(err => { console.error(err); process.exit(1) })
