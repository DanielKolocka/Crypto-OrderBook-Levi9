const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please add order ID']
    },
    createdDateTime: {
        type: Date,
        default: Date.now
    },
    currencyPair: {
        type: String, //schema.pre to fix this to BTCUSD
        // required: [true, 'Please enter Currency Pair'],
    },
    type: {
        type: String,
        required: [true, 'Please select order type.'],
        enum: {
            values: [
                'BUY',
                'SELL'
            ],
            message: 'Please choose BUY or SELL.'
        }
    },
    price: {
        type: Number,
        required: [true, 'Please enter trade price (2 decimals precision).']
    },
    quantity: {
        type: Number,
        required: [true, 'Please enter trade quantity (2 decimals precision)']
    },
    filledQuantity: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        default: 'OPEN'
    },
    trades: {
        type: [Object]
    },
},
    { versionKey: false }
);

orderSchema.pre('save', function (next) {
    this.CurrencyPair = 'BTCUSD';
    next();
});

module.exports = mongoose.model('Order', orderSchema);

// • Id – identifikator order-a
// • CurrencyPair – valuta na koju se odnosi trgovina. Fiksna vrednost BTCUSD
// (Bitcoin prema US dolaru)
// • CreatedDateTime - vreme kreiranja order-a
// • Type – tip order-a koji može biti BUY ili SELL
// • Price – cena izražena u decimalnoj vrednosti (preciznost 2 decimalna mesta)
// • Quantity - tražena količina izražena u decimalnoj vrednosti (preciznost 2
// decimalna mesta)
// • FilledQuantity - realizovana količina izražena u decimalnoj vrednosti (preciznost
// 2 decimalna mesta)
// • Status – status order-a koji može biti OPEN ili CLOSED
// • Trades – lista realizovanih trade-ova

