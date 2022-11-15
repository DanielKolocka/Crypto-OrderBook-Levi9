const Order = require('../models/order');

// Process new order => /order
exports.createOrder = async (req, res, next) => {

    const order = await Order.create(req.body);

    if (!order) {
        return res.status(400).json({
            success: false,
            message: 'Order has not been validated! (Invalid currency, type, negative price or quantity)'
        });
    }
    res.status(200).json({
        order
    });
}


// Get order by id => /order/$id
exports.getOrder = async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findOne({ orderId });

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found!'
        });
    }

    res.status(200).json({
        data: order
    });
}

// Get the orderbook => /orderbook
exports.getOrderBook = async (req, res, next) => {
    // const buyOrders = await Order.find({ type: 'BUY' }, 'price quantity');
    const buyOrders = await Order.aggregate(
        [
            { $match: { 'type': 'BUY' } },
            { $group: { _id: '$price', quantity: { $sum: '$quantity' } } },
            { $sort: { price: 1 } }
        ]
    );

    const sellOrders = await Order.aggregate(
        [
            { $match: { 'type': 'SELL' } },
            { $group: { _id: '$price', quantity: { $sum: '$quantity' } } },
            { $sort: { price: -1 } }
        ]
    );
    // const sellOrders = await Order.find({ type: 'SELL' }, 'price quantity').sort({ price: -1 });

    // console.log(buyOrders[0]['price']);

    res.status(200).json({
        buyOrders,
        sellOrders
    });
}

// Delete all orders => /order/all

