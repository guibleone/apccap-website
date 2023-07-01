const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware.js');

// rotas e funções
const {
    getResume,
    createResume,
    updateResume,
    deleteResume
} = require('../controllers/userResumeController');

// rotas 
router.route('/').get(protect, getResume).post(protect, createResume);
router.route('/:id').put(protect, updateResume).delete(protect, deleteResume);

module.exports = router;
