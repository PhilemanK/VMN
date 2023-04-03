//Importing Dependencies
const express = require('express')
const router = express.Router()
const { signupUser, loginUser, meUser } = require('../Controllers/userController')
const {protect} = require('../Middleware/authMiddleware')

//Post Route
router.post('/signup', signupUser)

//GET Route
router.get('/login', loginUser)

//GET Route
router.get('/me', protect, meUser)



//Exporting Router
module.exports = router