import express from 'express';
import './server/db/conn.js';
import router  from './server/router/auth.js';
import Razorpay from 'razorpay'
import PaymentRouter from './server/router/Paymentroute.js';
import BodyParser from 'body-parser';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

app.use(router);
app.use(BodyParser.json());
app.use(express.json());
app.use('/api',PaymentRouter)
app.use(express.static(path.join(__dirname,"../client/build")))

app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,"../client/build/index.html"));
})
export const instance = new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
})

app.listen(PORT,()=>{
    console.log(`Our server is running at port ${PORT}`);
})