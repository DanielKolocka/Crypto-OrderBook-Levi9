const mongoose = require('mongoose');

const orderBookSchema = new mongoose.Schema({
    BuyOrders: {},
    SellOrders: {}
});

module.exports = mongoose.model('OrderBook', orderBookSchema);