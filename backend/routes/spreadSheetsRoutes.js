const router = require('express').Router();
const { hasRole } = require('../middlewares/authMiddleware');
const { addSpreadSheet, getSpreadSheets, getOneSpread, deleteSpreadSheet, addExcel, deleteExcel, editSpreadSheet, getSpreadsWithoutLogin } = require('../controllers/spreadSheetControllers.js')
const { uploadExcel } = require('../middlewares/multer.js')


// pegar planilhas sem login
router.get('/spreadsheets', getSpreadsWithoutLogin)


// adicioanr planilha
router.post('/:id', hasRole('tesoureiro'), addSpreadSheet)

// adicionar plnailha Excel
router.post('/excel/:id', uploadExcel.single('pathExcel'), hasRole('tesoureiro'), addExcel)

// deletar planilha excel
router.delete('/excel/:id', hasRole('tesoureiro'), deleteExcel)

// pegar todas planilhas
router.get('/:id', hasRole('tesoureiro'), getSpreadSheets)

// pegar única planilha 
router.get('/single/:id', hasRole('tesoureiro'), getOneSpread)

// exclui planilha
router.delete('/:id', hasRole('tesoureiro'), deleteSpreadSheet)

// editar planilha
router.put('/:id', hasRole('tesoureiro'), editSpreadSheet)


module.exports = router