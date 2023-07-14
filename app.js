import express from 'express';
import './db/conn.js';
import router  from './router/auth.js';
import Razorpay from 'razorpay'
import PaymentRouter from './router/Paymentroute.js';
import BodyParser from 'body-parser';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(router);
app.use(BodyParser.json());
app.use(express.json());
app.use('/api',PaymentRouter)
app.use(express.static('./build'))

// app.use("*",function(req,res){
//     res.sendFile(path.join(__dirname,"../client/build/index.html"));
// })
export const instance = new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
})

app.listen(PORT,()=>{
    console.log(`Our server is running at port ${PORT}`);
})