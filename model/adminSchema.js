import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    img:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categ:{
        type:String,
        required:true
    }

})

const Admin = new mongoose.model('admin',adminSchema);

export default Admin;