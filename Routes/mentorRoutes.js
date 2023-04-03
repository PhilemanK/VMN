//Importing Dependencies
const express = require('express')
const router = express.Router()
const { signupMentor, loginMentor,  updateMentor } = require('../Controllers/mentorController')
const {protect} = require('../Middleware/authMiddleware')

//Post Route
router.post('/signup', signupMentor)

//GET Route
router.get('/login', loginMentor)


//UPDATE
router.put('/:id', updateMentor);



//Exporting Router
module.exports = router