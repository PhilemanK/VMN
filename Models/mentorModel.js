const { timeStamp } = require('console')
//Importing Mongoose
const mongoose = require('mongoose')

//Mentor Schema
const mentorSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true]
  },
  lastname: {
    type: String,
    required: [true]
  },
  password: {
    type: String,
    required: [true],
  },
  email: {
    type: String,
    required: [true],
    unique: true
  },
  number: {
    type: String,
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
  certifications: {
    type: String,
    required: [true]
  },
  experience: {
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

//Exporting mentorModel
module.exports = mongoose.model('Mentor', mentorSchema)