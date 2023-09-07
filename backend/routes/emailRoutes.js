const express = require('express');
const router = express.Router();

const { sendEmail, senConvocationEmail, sendRelatoryEmail, sendRecursoEmail } = require('../controllers/emailControllers.js');

router.post('/', sendEmail);
router.post('/convocation', senConvocationEmail);
router.post('/relatory', sendRelatoryEmail);
router.post('/recurso', sendRecursoEmail)

module.exports = router;