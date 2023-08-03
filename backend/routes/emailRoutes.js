const express = require('express');
const router = express.Router();

const { sendEmail } = require('../controllers/emailControllers.js');

router.post('/', sendEmail);

module.exports = router;