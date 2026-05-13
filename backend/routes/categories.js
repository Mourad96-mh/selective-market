const router = require('express').Router()
const Category = require('../models/Category')
const auth = require('../middleware/auth')

router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const q = req.params.slug.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.slug }
      : { slug: req.params.slug }
    const category = await Category.findOne(q)
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable' })
    Object.assign(category, req.body)
    await category.save()
    res.json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Catégorie supprimée' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
