const express = require('express')
const connectDB = require('./Config/db')
const dotenv = require('dotenv').config()
const port = process.env.PORT

//Creating app
const app = express()

//defaults
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



//User Endpoint
app.use('/users', require('./Routes/userRoutes'))
//Mentors Endpoint
app.use('/mentors', require('./Routes/mentorRoutes'))





//Server Started
app.listen(port, () => console.log("Server started on port : " + port))