const jwt=require('jsonwebtoken')
require('dotenv').config()
const jwtKey=process.env.JWT_KEY

module.exports=(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded=jwt.verify(token, jwtKey)
        req.userData=decoded
        next()
    }catch (error){
        return res.status(401).json({
            message:'Authentication Failed'
        })
    }
}