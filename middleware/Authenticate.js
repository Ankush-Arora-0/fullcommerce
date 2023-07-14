import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';

const Authenticate = async(req,res,next)=>{
    try{
        const token = req.cookies.jwtoken;
        console.log(token);
        const verifyToken= jwt.verify(token,process.env.SECRET_KEY);
        console.log(process.env.SECRET_KEY);
        const rootUser= await User.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!rootUser){
            throw new Error('user not found')
        }
       
            req.token =token;
            req.rootUser = rootUser;
            req.userId = rootUser._id;
        
        next();
}
catch(err){

    res.status(401).send('unauthorized');
}

}
export default Authenticate;