const mongoose= require('mongoose')
const bookSchema= new mongoose.Schema(
    {
        title:{
            type:String,
            require:true,
            unique:true
        },
        author:{
            type:String,
            require:true,
            unique:false
        },
        price:{
            type:Number,
            get:(value)=>value.toFixed(2),
            set:(value)=>parseFloat(value.toFixed(2)),
            require:true,
            unique:false
        },
        rating:{
            type:Number,
            min:0,
            max:5,
            get:(value)=>value.toFixed(1),
            set:(value)=>parseFloat(value.toFixed(1)),
            require:true,
            unique:false
        },
        username: {
            type: String,
            require: true,
        }
    }
)

module.exports=mongoose.model("Book", bookSchema)