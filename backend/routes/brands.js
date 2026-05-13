const router = require('express').Router()
const Brand = require('../models/Brand')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.featured === 'true') filter.featured = true
    const brands = await Brand.find(filter).sort({ name: 1 })
    res.json(brands)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const q = req.params.slug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.slug }
      : { slug: req.params.slug }
    const brand = await Brand.findOne(q)
    if (!brand) return res.status(404).json({ message: 'Marque introuvable' })
    res.json(brand)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const brand = await Brand.create(req.body)
    res.status(201).json(brand)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id)
    if (!brand) return res.status(404).json({ message: 'Marque introuvable' })
    Object.assign(brand, req.body)
    await brand.save()
    res.json(brand)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id)
    res.json({ message: 'Marque supprimée' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
