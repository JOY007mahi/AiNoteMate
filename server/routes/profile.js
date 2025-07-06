const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

// Setup multer for profile image uploads
const storage = multer.diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  },
})
const upload = multer({ storage })

// Dummy handler (Replace with real DB update)
router.post('/update-profile', upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, university, major } = req.body
    const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : null

    // Log data or update DB here
    console.log('✅ Profile Updated:', { name, email, university, major, avatarUrl })

    return res.status(200).json({ message: 'Profile updated successfully', avatarUrl })
  } catch (error) {
    console.error('❌ Failed to update profile:', error)
    return res.status(500).json({ error: 'Failed to update profile' })
  }
})

module.exports = router
