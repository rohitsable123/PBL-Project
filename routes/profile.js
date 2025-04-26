const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload Middleware
const upload = multer();

router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.query('SELECT fullname, email, phone, age, region, gender, profileImage FROM users WHERE id = ?', [req.session.userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(results[0]);
  });
});

router.post('/update', upload.single('profileImage'), async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { fullname, email, phone, age, region, gender } = req.body;
  let profileImageUrl = null;

  if (req.file) {
    try {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: 'profile_pictures' }, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
        profileImageUrl = result.secure_url;

        // After image upload success, update database
        db.query('UPDATE users SET fullname = ?, email = ?, phone = ?, age = ?, region = ?, gender = ?, profileImage = ? WHERE id = ?', 
          [fullname, email, phone, age, region, gender, profileImageUrl, req.session.userId],
          (err) => {
            if (err) return res.status(500).json({ message: 'Database update failed' });
            res.json({ message: 'Profile updated successfully' });
          }
        );
      });

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during upload' });
    }
  } else {
    // No new image, only update other fields
    db.query('UPDATE users SET fullname = ?, email = ?, phone = ?, age = ?, region = ?, gender = ? WHERE id = ?', 
      [fullname, email, phone, age, region, gender, req.session.userId],
      (err) => {
        if (err) return res.status(500).json({ message: 'Database update failed' });
        res.json({ message: 'Profile updated successfully' });
      }
    );
  }
});

module.exports = router;
