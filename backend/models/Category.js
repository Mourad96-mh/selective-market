const mongoose = require('mongoose')

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

categorySchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let base = slugify(this.name)
    let slug = base
    let n = 1
    while (await mongoose.model('Category').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${n++}`
    }
    this.slug = slug
  }
  next()
})

module.exports = mongoose.model('Category', categorySchema)
