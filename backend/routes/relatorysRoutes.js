const express = require('express');
const { hasRole } = require('../middlewares/authMiddleware');
const {
    addRelatory,
    deleteRelatory,
    getRelatorys,
} = require('../controllers/relatorysControllers');
const { uploadRelatory } = require('../middlewares/multer');

const router = express.Router();

//pegar relatórios
router.get('/', getRelatorys);

// adicionar relatório
router.post('/', uploadRelatory.single('path'), hasRole('secretario'), addRelatory);

// deletar relatório
router.delete('/:id', hasRole('secretario'), deleteRelatory);

module.exports = router;