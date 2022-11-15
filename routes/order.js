const express = require('express');
const router = express.Router();

const { getOrder, createOrder, getOrderBook } = require('../controllers/orderController');

router.route('/order/:id').get(getOrder);
router.route('/orderbook').get(getOrderBook);

router.route('/order').post(createOrder);

module.exports = router;