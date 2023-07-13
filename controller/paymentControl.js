import { instance } from "../../app.js";
import crypto from 'crypto';
import OrderMod from "../model/order.js";

export const checkout = async (req, res) => {
    const { name, email, date, qty, time, status, img, pname, price, description } = req.body;
    const options = {
        amount: Number(req.body.price * 100),  // amount in the smallest currency unit
        currency: "INR",
    };
    const key_id = process.env.KEY_ID;
    const order = await instance.orders.create(options);
    const orderData = { name, email, date, qty, time, status, img, pname, price, description, order_id: order.id }
    try {
        const dataSave = await OrderMod.create(orderData);
        await dataSave.save();
    }
    catch (err) {

    }
    res.status(200).json({
        success: true,
        order,
        key_id
    })

}




export const paymentVerification = async (req, res) => {


    const data = await req.body;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const response = expectedSignature === razorpay_signature

    if (response) {
        const orderFind = await OrderMod.findOne({ order_id: razorpay_order_id });
        orderFind.transaction_ids = await orderFind.transaction_ids.concat({ transaction_id: razorpay_payment_id })
        await orderFind.save();
        res.redirect('http://localhost:3000/');
    }
    else {
        await OrderMod.deleteOne({ order_id: razorpay_order_id });
        res.redirect('http://localhost:3000/');

    }
}