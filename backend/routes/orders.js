const router = require('express').Router()
const Order = require('../models/Order')
const Product = require('../models/Product')
const auth = require('../middleware/auth')

router.post('/', async (req, res) => {
  try {
    const { items, customer, notes } = req.body
    if (!items?.length || !customer) return res.status(400).json({ message: 'Données manquantes' })
    const total = items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0)
    const order = await Order.create({ items, customer, total, notes })
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/stats/summary', auth, async (_req, res) => {
  try {
    const [totalProducts, totalOrders, pendingOrders, revenue, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ])
    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      revenue: revenue[0]?.total || 0,
      recentOrders,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ]
    }
    const skip = (Number(page) - 1) * Number(limit)
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ])
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ message: 'Commande supprimée' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
