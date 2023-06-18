const express = require('express')
const app= express()
const mongoose=require('mongoose')
const port=3000

const bookRoute=require('./routes/book')
const userRoute=require('./routes/user')

app.use(express.json())

app.use('/book', bookRoute)
app.use('/user', userRoute)

mongoose.connect('mongodb://0.0.0.0:27017/Book', {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>'Connected to MongoDB').catch(err => console.error('Something went wrong', err))

//Error handling
app.use((req,res)=>{
    res.status(404)
    res.json({
        message: 'Not Found'
    })
})

app.listen(port,()=>{
    console.log(`App Listening on port ${port}`)
})