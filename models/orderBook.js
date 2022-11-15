const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    BuyOrderId: {},
    SellOrderId: {},
    CreatedDateTime: {},
    Price: {},
    Quantity: {},
});

module.exports = mongoose.model('Trade', tradeSchema);