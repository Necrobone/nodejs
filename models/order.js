const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    products: [{
        product: {
            type: Object,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }
});

module.exports = mongoose.model('Order', Order);
