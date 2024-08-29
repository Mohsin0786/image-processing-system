// Webhook endpoint
const express = require('express');
const { statusWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/webhook', statusWebhook);

module.exports = router;