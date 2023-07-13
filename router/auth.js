import express from 'express';
import Admin from '../model/adminSchema.js';
import cors from 'cors';
import BodyParser from 'body-parser';
import User from '../model/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import Authenticate from '../middleware/Authenticate.js';
import OrderMod from '../model/order.js';
const router = express.Router();
router.use(BodyParser.json())
router.use(cookieParser());
router.use(cors({
    origin: ['http://localhost:3000','https://ecommerce-app.onrender.com' ],// Replace with your frontend domain
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }));



router.post('/admin/crtprod',async(req,res)=>{
    const resp = req.body; 
   
    try{
        const adminData = await Admin.create(resp)
        await adminData.save();
        res.status(201).send("Data saved");
    }
    catch(err){
     
        res.status(401).send("not send")
    }
})

router.post('/register',async(req,res)=>{
    const userbody = req.body;
   
    const userChk = await User.findOne({email:userbody.email});
    try{
        if(userChk===null){
            if(userbody.pass===userbody.cpass){
           const dataSave= await User.create(userbody);
           await dataSave.save();
           res.status(201).send("Data saved");}
           else{
            res.status(402).send("password and confirm password does not match")
           }
        }
        else{
            res.status(401).send("You are already a user");
        }
    }
    catch(err){
      
        res.status(403).send("There was a server error");
    }
})
router.post('/login',async(req,res)=>{
    const userData = req.body;
    try{
        const userVerify = await User.findOne({email:userData.email});
        if(userVerify.email===null){
            res.status(402).send("You are not a existing user");
        }
        else{
        if(bcrypt.compare(userData.pass,userVerify.pass)){
        const token = jwt.sign({_id:userVerify._id},process.env.SECRET_KEY);
        userVerify.tokens = userVerify.tokens.concat({ token: token }); // Assigning the concatenated value back to userVerify.tokens
        await userVerify.save();
        res.cookie('jwtoken',token,
        {
            expires: new Date(Date.now()+2589200000),
            httpOnly:true,
            sameSite: 'none',
            secure: true
        })
        if(userVerify.email==='admin@gmail.com'){
            res.status(200).send("admin login");
        }
        else{
            res.status(201).send("success");
        }
    }
    else{
        res.status(401).send("Invalid credentials");
    }
    }
}
    catch(err){
    
        res.status(403).send("There was a server error");
    }
})

router.get('/home',async(req,res)=>{
    try{
        const authdata = req.rootUser;
        const data=await Admin.find({});
        
        
        res.status(201).send(data);
    }
    catch(err){
        
    }
})
router.get('/homeedit',async(req,res)=>{
    try{
        const data=await Admin.find({categ:userdata.categ});
        res.status(201).send(data);
    }
    catch(err){
      
    }
})
router.post('/cart',Authenticate,async(req,res)=>{
    
    try{
        const data = await req.rootUser;
        const dataBody = await req.body;
        let imgChk2=true;
       const imgChk = await data.cartitems.forEach(element => {
         if(element.item.img===dataBody.img){
          imgChk2 = false;
         }
        })
        

        
        if(!data){
            res.status(401).send("Please login first");
        }
        else if(imgChk2===false){
            res.status(202).send("already in cart");
        }
        else{
            data.cartitems =  data.cartitems.concat({item:dataBody});
            await data.save();
            res.status(201).send("Added to cart");
        }
    }
    catch(err){
        res.status(402).send('server error')
       
    }
})
router.get('/cartdata',Authenticate,async(req,res)=>{
    try{
        const authdata = await req.rootUser;
        const data = await User.findOne({email:authdata.email});
        if(!data){
            res.status(401).send('server error');
        }
        else{
            res.status(201).send(data);
            
        }
    }
    catch(err){
        res.status(402).send('serverr error');
    }
});

router.get('/cartdata1',Authenticate,async(req,res)=>{
    try{
        const authdata = await req.rootUser;
        const data = await User.findOne({email:authdata.email});
        if(!data){
            res.status(401).send('server error');
        }
        else{
            res.status(201).send(data.cartitems);
       
        }
    }
    catch(err){
        res.status(402).send('serverr error');
    }
});
router.delete('/rmitem',Authenticate,async(req,res)=>{
    try{
        const authdata = await req.rootUser;
        const data = await req.body;
        const cartItemIndex = await data.itemIndex;
        if(!data){
            res.status(401).send('server error');
        }
        else{
            authdata.cartitems.splice(cartItemIndex, 1);
            await authdata.save();
            res.status(201).send('deleted successfully');
            
        }
    }
    catch(err){
        res.status(402).send('serverr error');
    }
})
router.get('/logout',async(req,res)=>{
   
    res.clearCookie("jwtoken",{path:"/"});
    res.status(201).send('User Logged out');
})
router.get('/h',Authenticate,(req,res)=>{
    if(!req.rootUser){
        res.status(402).send("please login")

    }
    res.status(201).send(req.rootUser)
})
router.post('/order',async(req,res)=>{
    try{
    const data =req.body;
    
    const dataSave= await OrderMod.create(data);
        await dataSave.save();
        res.status(201).send('order accepted')
   }
   catch(err){
   
    res.status(402).send('order rejected')
   }
})
router.get('/allorder',async(req,res)=>{
    try{    
        const data = await OrderMod.find({});
        if(!data){
            res.status(401).send('no order')
        }
        else{
            res.status(201).send(data);
        }
    }
    catch(err){
       
        res.status(402).send('server error')
    }
})
router.put('/upstatus',async(req,res)=>{
    try{
        const data = await req.body;
        const {status} = data;
        const odData = await OrderMod.updateOne({email:data.email},{$set:{status}});
        res.status(201).send('updated succcesfully')
        
    }
    catch(err){
        res.status(402).send('server error')
    }
})
router.get('/myorders',Authenticate,async(req,res)=>{
    const authdata = req.rootUser;
    const data = await OrderMod.find({email:authdata.email});
    try{
        if(!data){
            res.status(401).send("data not found");
        }
        else{
            res.status(201).send(data);
        }
    }
    catch(err){
    
        res.status(402).send('server error');
    }
});

router.get("/getdata",Authenticate,(req,res)=>{
    try{
    const data = req.rootUser;
    if(!data){
        res.status(401).send("No data found");
    }
    else{
        res.status(201).send(data);
    }
}
    catch(err){
        res.status(402).send("server error")
    }

});
router.post("/orderhome",async(req,res)=>{
    try{
        const data =await req.body;
        
        if(!data){
            res.status(402).send("error")
        }
        else{
            const dataSave= await OrderMod.create(data);
            await dataSave.save();
            res.status(201).send("saved data")
        }
    }
    catch(err){
   
        res.status(401).send("server error")
    }
})

export default router;
