import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    cartitems:[
        {
            item:{
                img:{
                    type:String,
                    required:true
                },
                name:{
                    type:String,
                    required:true
                },
                price:{
                    type:String,
                    required:true
                },
                description:{
                    type:String,
                    required:true
                }
            }
        }
    ]
    
})

userSchema.pre('save',async function(next){
    
    if(this.isModified('pass')){
        this.pass = await bcrypt.hash(this.pass,10);
    
    }
    next();
})

const User = mongoose.model('registered',userSchema);

export default User;