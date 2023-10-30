const express = require('express');
const router = express.Router();
const { createPublication, getPublications} = require('../controllers/blogControllers.js');
const { uploadProfilePhoto } = require('../middlewares/multer.js');

// pegar notícias
router.get('/', getPublications)

// criar uma nova notícia
router.post('/', uploadProfilePhoto.single('thumbnail'), createPublication)


module.exports = router;



