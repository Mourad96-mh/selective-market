const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    discountPrice: Number,
    quantity: Number,
    image: String,
    volume: String,
  }],
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
  },
  total: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `PF-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)
