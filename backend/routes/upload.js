const router = require('express').Router()
const cloudinary = require('cloudinary').v2
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier fourni' })

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'parfumerie', quality: 'auto', fetch_format: 'auto' }, (err, r) =>
          err ? reject(err) : resolve(r)
        )
        .end(req.file.buffer)
    })

    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/', auth, async (req, res) => {
  try {
    const { publicId } = req.body
    if (!publicId) return res.status(400).json({ message: 'publicId requis' })
    await cloudinary.uploader.destroy(publicId)
    res.json({ message: 'Image supprimée' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
