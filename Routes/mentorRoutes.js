//Importing Dependencies
const express = require('express')
const router = express.Router()
const { signupMentor, loginMentor, meMentor } = require('../Controllers/mentorController')
const {protect} = require('../Middleware/authMiddleware')

//Post Route
router.post('/signup', signupMentor)

//GET Route
router.get('/login', loginMentor)

//GET Route
router.get('/me', protect, meMentor)



//Exporting Router
module.exports = router