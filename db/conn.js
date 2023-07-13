import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path:"./config.env"});

const db = process.env.DBS;

mongoose.connect(db, { 
    useNewUrlParser: true,
    
  })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));