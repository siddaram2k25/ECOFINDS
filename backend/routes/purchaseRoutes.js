const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { checkout, getPreviousPurchases } = require('../controllers/purchaseController');

router.post('/checkout', auth, checkout);
router.get('/', auth, getPreviousPurchases);

module.exports = router;
