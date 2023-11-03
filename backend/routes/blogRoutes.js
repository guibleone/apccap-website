const express = require('express');
const router = express.Router();
const { createPublication, getPublications, getSinglePublication, deletePublication, editPublication} = require('../controllers/blogControllers.js');
const { uploadProfilePhoto } = require('../middlewares/multer.js');

// pegar notícias
router.get('/', getPublications)

// pegar única notícia
router.get('/:id', getSinglePublication)

// criar uma nova notícia
router.post('/', uploadProfilePhoto.single('thumbnail'), createPublication)

// deletar uma notícia
router.delete('/:id', deletePublication)

// editar uma notícia
router.put('/:id', uploadProfilePhoto.single('thumbnail'), editPublication)


module.exports = router;



