const mongoose = require('mongoose')

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  logoPublicId: { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

brandSchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let base = slugify(this.name)
    let slug = base
    let n = 1
    while (await mongoose.model('Brand').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${n++}`
    }
    this.slug = slug
  }
  next()
})

module.exports = mongoose.model('Brand', brandSchema)
