const router = require('express').Router()
const Product = require('../models/Product')
const Category = require('../models/Category')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const { search, category, brand, gender, concentration, featured, isNew, inStock, onPromo, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query
    const filter = {}

    if (search) filter.$text = { $search: search }
    if (category) {
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        filter.category = category
      } else {
        const cat = await Category.findOne({ slug: category })
        filter.category = cat?._id ?? null
      }
    }
    if (brand) filter.brand = brand
    if (gender) filter.gender = gender
    if (concentration) filter.concentration = concentration
    if (featured === 'true') filter.featured = true
    if (isNew === 'true') filter.isNew = true
    if (inStock === 'true') filter.stock = { $gt: 0 }
    if (onPromo === 'true') filter.$or = [
      { discountPrice: { $ne: null, $gt: 0 } },
      { 'variants.discountPrice': { $ne: null, $gt: 0 } },
    ]
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const sortMap = {
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      newest:     { createdAt: -1 },
      name_asc:   { name: 1 },
      name_desc:  { name: -1 },
      featured:   { featured: -1, createdAt: -1 },
    }
    const sortObj = sortMap[sort] || { createdAt: -1 }

    const skip = (Number(page) - 1) * Number(limit)
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').populate('brand', 'name slug logo').sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ])

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const q = req.params.slug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.slug }
      : { slug: req.params.slug }
    const product = await Product.findOne(q).populate('category', 'name slug').populate('brand', 'name slug logo')
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    Object.assign(product, req.body)
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Produit supprimé' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
