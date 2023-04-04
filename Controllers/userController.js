//Importing Express-async-handler
const asyncHandler = require('express-async-handler')
//Importing JWT
const jwt = require('jsonwebtoken')
//Importing bcrypt
const bcrypt = require('bcrypt')
//Importing joi
const Joi = require('joi')
const express = require('express');
const app = express();

//Importing userModel mentorModel
const User = require('../Models/userModel')
const Mentor = require('../Models/mentorModel')
const Request = require('../Models/requestModel')

// Joi postValidation
const postValidation = Joi.object({
  firstname: Joi.string().required().messages({
    'string.base': 'First name must be a string',
    'string.empty': 'First name cannot be empty',
    'any.required': 'First name is required'
  }),
  lastname: Joi.string().required().messages({
    'string.base': 'Last name must be a string',
    'string.empty': 'Last name cannot be empty',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().required().email().messages({
      'any.required': 'Email is required',
  }),
  password: Joi.string().required().min(8).messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  number: Joi.number().required().messages({
    'number.min': 'Number must be 10 characters long',
    'any.required': 'Number is required',
  }),
  domain: Joi.string().required().messages({
      'string.base': 'Domain must be a string',
      'string.empty': 'Domain cannot be empty',
      'any.required': 'Domain is required'
  }),
  subdomain: Joi.string().required().messages({
      'string.base': 'Sub-Domain must be a string',
      'string.empty': 'Sub-Domain cannot be empty',
      'any.required': 'Sub-Domain is required'
  }),
  linkedin: Joi.string().required().messages({
    'string.base': 'Linkedin must be a string',
    'string.empty': 'Linkedin cannot be empty',
    'any.required': 'Linkedin is required'
}),
  github: Joi.string().required().messages({
      'string.base': 'GitHub must be a string',
      'string.empty': 'GitHub cannot be empty',
      'any.required': 'GitHub is required'
  }),
});



//REGISTER
// @desc POST USER
// POST /signup
// access PUBLIC
const signupUser = asyncHandler(async (req, res) => {

  //Validation
  const { firstname, lastname, email, password,  number, domain, subdomain, linkedin, github, error } = await postValidation.validateAsync(req.body);


  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  //Checking if user exists
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists) {
    res.status(400);
    throw new Error('User already exists')
  }

  //Hashing password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Validating and inserting user data in DB
  if (req.body.firstname && req.body.lastname && req.body.email && req.body.password && req.body.number && req.body.domain && req.body.subdomain &&  req.body.linkedin &&  req.body.github) {
    const userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
      number: req.body.number,
      domain: req.body.domain,
      subdomain: req.body.subdomain,
      linkedin: req.body.linkedin,
      github: req.body.github,
      createdAt: new Date()
    };

    //Inserting user in DB
    const user = await User.create(userData);

    if (user) {
        console.log(user + " User registerd");
        res.status(201).json({
          _id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          number: user.number,
          domain: user.domain,
          subdomain: user.subdomain,
          github: user.github,
          token: generateToken(user._id)
        });
    }
    else {
      res.status(400)
      throw new Error('Error')
    }
  }
})

//LOGIN
// @desc GET USER
// GET /login
// access PUBLIC
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    //Check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        console.log(user + " Logged in");
        res.status(201).json({
          _id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          number: user.number,
          domain: user.domain,
          subdomain: user.subdomain,
          github: user.github,
          token: generateToken(user._id)
        });
    }
    else{
        res.status(400)
        throw new Error('Error')
    }

})

//UPDATE
const updateUser = asyncHandler( async (req, res) => {
  const { id } = req.params;
  const {firstname, lastname, email, password, number, domain, subdomain, certifications, experience, github } = req.body;

  try {
    // Check if user is authorized
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.id !== id) {
      res.status(401)
      throw new Error('Not authorized')
    }
  }catch (error) {
    console.log(error)
    res.status(401)
    throw new Error('Not authorized')
  }

  //Hashing password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  User.findByIdAndUpdate(id, { firstname, lastname, email, password: hashPassword, number, domain, subdomain, certifications, experience, github }, { new: true })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

//homepageUser
const homepageUser = asyncHandler( async (req, res) => {
  try {
    const mentors = await Mentor.find({ domain: 'abc' });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})


//searchUser
const searchUser =  asyncHandler( async (req, res) => {
  const { email, domain, subdomain, firstname } = req.body;
  try {
    const mentors = await Mentor.find({ $or: [{ email }, { domain }, { subdomain }, { firstname }] });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})




//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}



//Exporting userController
module.exports = {
  signupUser, loginUser, updateUser, homepageUser, searchUser,
}
