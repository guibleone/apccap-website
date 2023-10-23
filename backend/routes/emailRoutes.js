const express = require('express');
const router = express.Router();

const { sendEmail, senConvocationEmail, sendRelatoryEmail, sendRecursoEmail,sendProductRelatoryEmail, sendResetEmail } = require('../controllers/emailControllers.js');

router.post('/', sendEmail);
router.post('/reset', sendResetEmail);
router.post('/convocation', senConvocationEmail);
router.post('/relatory', sendRelatoryEmail);
router.post('/recurso', sendRecursoEmail)
router.post('/produto', sendProductRelatoryEmail)

module.exports = router;