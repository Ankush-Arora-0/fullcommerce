import express from 'express';
import { checkout, paymentVerification } from '../controller/paymentControl.js';
import bodyParser from 'body-parser'; // Add this line

const router2 = express.Router();
router2.use(bodyParser.urlencoded({ extended: true })); 
router2.route("/checkout").post(checkout);
router2.route("/paymentverification").post(paymentVerification);
export default router2;