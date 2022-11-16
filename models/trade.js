// const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    BuyOrderId: {
        type: String,
        required: true
    },
    SellOrderId: {
        type: String,
        required: true
    },
    CreatedDateTime: {
        type: Date,
        default: Date.now
    },
    Price: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Trade', tradeSchema);