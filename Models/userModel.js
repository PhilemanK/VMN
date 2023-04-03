const { timeStamp } = require('console')
//Importing Mongoose
const mongoose = require('mongoose')

//User Schema
const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true]
  },
  lastname: {
    type: String,
    required: [true]
  },
  email: {
    type: String,
    required: [true],
    unique: true
  },
  password: {
    type: String,
    required: [true],
  },
  number: {
    type: Number,
    required: [true]
  },
  domain: {
    type: String,
    required: [true]
  },
  subdomain: {
    type: String,
    required: [true]
  },
  linkedin: {
    type: String,
    required: [true]
  },
  github: {
    type: String,
    required: [true]
  },
},
  {
    timeStamps: true,
  })


  

//Exporting userModel
module.exports = mongoose.model('User', userSchema,)