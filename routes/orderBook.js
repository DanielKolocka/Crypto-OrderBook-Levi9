const express = require('express');
const router = express.Router();

const { getOrderBook, deleteOrderBook } = require('../controllers/orderBookController');

router.route('/orderbook').get(getOrderBook);

router.route('/order/all').delete(deleteOrderBook);

module.exports = router;