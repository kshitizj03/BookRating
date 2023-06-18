const router = require("express").Router()
const User=require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const checkAuth=require('../middleware/auth')
require('dotenv').config()

const jwtKey=process.env.JWT_KEY

//signup
router.post('/signup', async(req,res)=>{
    try {
        const existingUser=await User.findOne({email:req.body.email})
        if(existingUser){
            return res.status(400).json({
                message: 'Email already exists'
            })
        }
        else{

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)
    
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
        })
    
        const user = await newUser.save()
        res.status(201).json(user)}
    } catch (error) {
        res.status(500).json(error)
    }
    
})

//login
router.post('/login', async(req,res)=>{
    try{
        const user= await User.findOne({username:req.body.username})

        //user not found
        if(!user){
            return res.status(401).json('Wrong Credentials')
        }
        //User password check
        const validate=await bcrypt.compare(req.body.password ,user.password)

        //Password Incorrect
        if(!validate){
            return res.status(401).json('Wrong Credentials')
        }

        const token=jwt.sign({
            userId:user._id,
            email: user.email
        }, jwtKey,{expiresIn:'1h'})
        res.status(200).json({message:'Authentication Successful',token: token})
    }catch (error){
        res.status(500).json(error)
      }
})



//Delete User
router.delete("/:id", checkAuth,async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndRemove(req.params.id);
        if (deleteUser) {
          res.status(200).json('User has been Deleted');
        } else {
          res.status(404).json('User not found');
        }
      } catch (error) {
        res.status(500).json(error);
      }
})

//Update User
router.put("/:id", checkAuth,async (req, res) => {
    if (req.body.userId === req.params.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        )
        res.status(200).json(updatedUser)
      } catch (error) {
        res.status(500).json(error)
      }
    } else {
      res.status(401).json("You can update your account only")
    }
})



module.exports=router