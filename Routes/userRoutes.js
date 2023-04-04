//Importing Dependencies
const express = require('express')
const router = express.Router()
const { signupUser, loginUser, updateUser, homepageUser, searchUser } = require('../Controllers/userController')
const {protect} = require('../Middleware/authMiddleware')


//Post Route
router.post('/signup', signupUser)

//GET Route
router.get('/login', loginUser)

//UPDATE
router.put('/:id', updateUser);

//HOMEPAGE
router.get('/homepageUser', homepageUser);

//Search
router.get('/searchUser', searchUser);





//Exporting Router
module.exports = router