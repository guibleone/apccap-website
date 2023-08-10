const express = require('express');
const router = express.Router();

const { sendEmail, senConvocationEmail } = require('../controllers/emailControllers.js');

router.post('/', sendEmail);
router.post('/convocation',  senConvocationEmail);

module.exports = router;