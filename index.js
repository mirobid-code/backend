const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const cotegoryRoute = require('./routes/category')
const app = express()
const cors = require('cors')
const path = require('path')
// const multerRoute = require('./multer')
const productRoute = require('./routes/product')

app.use(cors())
app.use(express.json())




let url = "mongodb+srv://mirobidolmasov:mirobid_07@mirobid.velgm.mongodb.net/?retryWrites=true&w=majority&appName=mirobid"

mongoose.connect(url)
.then(() =>{console.log('Succes connect to Db')})
.catch((e) => {console.log('error in db', e)});

app.use('/auth', authRoute )
app.use('/category', cotegoryRoute) 
app.use('/product', productRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// app.use('/uploads', multerRoute )

app.listen(3000, () => {
    console.log("3000 port ulandi");
    
})



