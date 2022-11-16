const { default: mongoose } = require('mongoose');
const Order = require('../models/order');
const Trade = require('../models/trade');

// Process new order => /order
exports.createOrder = async (req, res, next) => {

    const order = await Order.create(req.body);

    if (!order) {
        return res.status(400).json({
            success: false,
            message: 'Order has not been validated! (Invalid currency, type, negative price or quantity)'
        });
    }


    if (order.type == 'BUY') {
        const possibleOrders = await Order.find(
            { type: 'SELL', orderStatus: 'OPEN', price: { $lte: order.price } },
            // $match: { orderStatus: 'OPEN' },
            // price: { $lte: order.price }
        ).sort({ createdDateTime: 1 });

        let size = 0;
        possibleOrders.forEach(() => { size += 1 });

        let i = 0;
        while (i < size) {
            const orderLeft = order.quantity - order.filledQuantity;
            const possibleOrderAvailable = possibleOrders[i].quantity - possibleOrders[i].filledQuantity;
            if (orderLeft < possibleOrderAvailable) {
                const trade = await Trade.create({
                    BuyOrderId: order.id,
                    SellOrderId: possibleOrders[i].id,
                    Price: possibleOrders[i].price,
                    Quantity: orderLeft
                });

                Order.findOneAndUpdate({ id: order.id }, {
                    orderStatus: 'CLOSED',
                    $inc: { filledQuantity: orderLeft },
                    $push: { trades: trade }
                },
                    { new: true },
                    (err, data) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(data);
                        }
                    });
                Order.findOneAndUpdate({ id: possibleOrders[i].id }, {
                    $inc: { filledQuantity: orderLeft },
                    $push: { trades: trade }
                },
                    { new: true },
                    (err, data) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(data);
                        }
                    });
                break;
            }

            if (orderLeft >= possibleOrderAvailable) {
                const trade = await Trade.create({
                    BuyOrderId: order.id,
                    SellOrderId: possibleOrders[i].id,
                    Price: possibleOrders[i].price,
                    Quantity: possibleOrderAvailable
                });

                Order.findOneAndUpdate({ id: order.id }, {
                    $inc: { filledQuantity: possibleOrderAvailable },
                    $push: { trades: trade }
                }, { new: true }, (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(data);
                    }
                });
                Order.findOneAndUpdate({ id: possibleOrders[i].id }, {
                    orderStatus: 'CLOSED',
                    $inc: { filledQuantity: possibleOrderAvailable },
                    $push: { trades: trade }
                }, { new: true }, (err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(data);
                    }
                });
                i++;
            }
        }
    }

    res.status(200).json({
        order
        // possibleOrders
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
// exports.deleteOrderBook = async (req, res, next) => {
//     orderbook.orders.drop(function () {
//         console.log('Order collection dropped');
//     });
//     orderbook.trades.drop(function () {
//         console.log('Order collection dropped');
//     });

//     res.status(200);
// }
