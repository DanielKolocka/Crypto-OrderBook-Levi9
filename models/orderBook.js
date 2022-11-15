const mongoose = require('mongoose');

const orderBookSchema = new mongoose.Schema({
    BuyOrders: {
        type: [Object]
    },
    SellOrders: {
        type: [Object]
    }
});

module.exports = mongoose.model('OrderBook', orderBookSchema);