const express = require('express')
const router = express.Router()
const { paySelos } = require('../controllers/paymentControllers.js')

// pagar selos
router.post('/comprar-selos', paySelos)

module.exports = router
