const router = require('express').Router();
const { hasRole } = require('../middlewares/authMiddleware');
const { addSpreadSheet, getSpreadSheets, getOneSpread, deleteSpreadSheet, addExcel } = require('../controllers/spreadSheetControllers.js')
const { uploadExcel } = require('../middlewares/multer.js')


// adicioanr planilha
router.post('/:id', hasRole('tesoureiro'), addSpreadSheet)

// adicionar plnailha Excel
router.post('/excel/:id', uploadExcel.single('pathExcel'), hasRole('tesoureiro'), addExcel)

// pegar todas planilhas
router.get('/:id', hasRole('tesoureiro'), getSpreadSheets)

// pegar única planilha 
router.get('/single/:id', hasRole('tesoureiro'), getOneSpread)

// exclui planilha
router.delete('/:id', hasRole('tesoureiro'), deleteSpreadSheet)

module.exports = router