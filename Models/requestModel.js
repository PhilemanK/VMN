const { timeStamp } = require('console')
//Importing Mongoose
const mongoose = require('mongoose')

//Mentor Schema
const requestSchema = mongoose.Schema({
  user_email: {
    type: String,
    required: [true],
    unique: true
  },

  mentor_email: {
    type: String,
    required: [true],
    unique: true
  },


  

},
  {
    timeStamps: true,
  })

//Exporting mentorModel
module.exports = mongoose.model('Request', requestSchema)