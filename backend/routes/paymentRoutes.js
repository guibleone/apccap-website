const express = require('express')
const router = express.Router()
const { paySelos, payMensalidade, getSubscription } = require('../controllers/paymentControllers.js')
const { protect } = require('../middlewares/authMiddleware.js')

// pagar selos
router.post('/comprar-selos', paySelos)

// pagar mensalidade
router.post('/comprar-mensalidade', payMensalidade)

// pegar assinatura
router.post('/assinatura', protect, getSubscription)


module.exports = router
