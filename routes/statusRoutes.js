// routes/statusRoutes.js
const express = require('express');
const { checkStatus,downloadCSV } = require('../controllers/statusController');

const router = express.Router();

router.get('/status/:requestId', checkStatus);
router.get('/download-csv/:requestId',downloadCSV)

module.exports = router;