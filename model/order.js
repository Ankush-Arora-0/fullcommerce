import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    pname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    transaction_ids: [
        {
            transaction_id: {
                type: String,
                required: true
            }
        }
    ]
});

const OrderMod = new mongoose.model('order', orderSchema);

export default OrderMod;