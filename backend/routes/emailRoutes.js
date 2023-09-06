const express = require('express');
const router = express.Router();

const { sendEmail, senConvocationEmail,sendRelatoryEmail } = require('../controllers/emailControllers.js');

router.post('/', sendEmail);
router.post('/convocation',  senConvocationEmail);
router.post('/relatory', sendRelatoryEmail);

module.exports = router;