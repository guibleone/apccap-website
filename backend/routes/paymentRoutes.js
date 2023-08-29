const express = require('express')
const router = express.Router()
const { paySelos, payMensalidade, getSubscription, getBalance } = require('../controllers/paymentControllers.js')
const { protect } = require('../middlewares/authMiddleware.js')

// pagar selos
router.post('/comprar-selos', paySelos)

// pagar mensalidade
router.post('/comprar-mensalidade', payMensalidade)

// pegar assinatura
router.post('/assinatura', protect, getSubscription)

// pegar balance

router.get('/balance', protect, getBalance)

module.exports = router
