const express = require('express');
const router = express.Router();

const { getOrder, createOrder, getOrderBook, deleteOrderBook } = require('../controllers/orderController');

router.route('/order/:id').get(getOrder);
router.route('/orderbook').get(getOrderBook);

router.route('/order').post(createOrder);

// router.route('/order/all').delete(deleteOrderBook);

module.exports = router;