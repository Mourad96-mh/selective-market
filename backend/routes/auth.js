const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const auth = require('../middleware/auth')

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Champs requis' })

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, email: admin.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/credentials', auth, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body
    const admin = await Admin.findById(req.admin.id)

    if (!(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' })
    }

    if (email) admin.email = email.toLowerCase()
    if (newPassword) admin.password = newPassword
    await admin.save()

    res.json({ message: 'Identifiants mis à jour' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
