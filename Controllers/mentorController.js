//Importing Express-async-handler
const asyncHandler = require('express-async-handler')
//Importing JWT
const jwt = require('jsonwebtoken')
//Importing bcrypt
const bcrypt = require('bcrypt')
//Importing joi
const Joi = require('joi')
//Importing userModel
const Mentor = require('../Models/mentorModel')



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
    certifications: Joi.string().required().messages({
        'string.base': 'Certifications must be a string',
        'string.empty': 'Certifications cannot be empty',
        'any.required': 'Certifications is required'
    }),
    experience: Joi.string().required().messages({
        'string.base': 'Experience must be a string',
        'string.empty': 'Experience cannot be empty',
        'any.required': 'Experience is required'
    }),
    github: Joi.string().required().messages({
        'string.base': 'GitHub must be a string',
        'string.empty': 'GitHub cannot be empty',
        'any.required': 'GitHub is required'
    }),
  });


//REGISTER
// @desc POST MENTOR
// POST /signup
// access PUBLIC
const signupMentor = asyncHandler(async (req, res) => {


  //Validation
  const { firstname, lastname, email, password,  number, domain, subdomain, certifications, experience, github, error } = await postValidation.validateAsync(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  //Checking if user exists
  const mentorExists = await Mentor.findOne({ email: req.body.email })
  if (mentorExists) {
    res.status(400);
    throw new Error('Mentor already exists')
  }

  //Hashing password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Validating and inserting user data in DB
  if (req.body.firstname && req.body.lastname && req.body.email && req.body.password && req.body.number && req.body.domain && req.body.subdomain && req.body.certifications && req.body.experience && req.body.github) {
    const mentorData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
      number: req.body.number,
      domain: req.body.domain,
      subdomain: req.body.subdomain,
      certifications: req.body.certifications,
      experience: req.body.experience,
      github: req.body.github,
      createdAt: new Date()
    };

    //Inserting user in DB
    const mentor = await Mentor.create(mentorData);

    if (mentor) {
        console.log(mentor + " Mentor registerd");
        res.status(201).json({
            _id: mentor.id,
            firstname: mentor.firstname,
            lastname: mentor.lastname,
            email: mentor.email,
            password: mentor.password,
            number: mentor.number,
            domain: mentor.domain,
            subdomain: mentor.subdomain,
            certifications: mentor.certifications,
            experience: mentor.experience,
            github: mentor.github,
            token: generateToken(mentor._id)
        });
    }
    else {
      res.status(400)
      throw new Error('Error')
    }
  }
})




//LOGIN
// @desc GET MENTOR
// GET /login
// access PUBLIC
const loginMentor = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    //Check for user email
    const mentor = await Mentor.findOne({email})

    if(mentor && (await bcrypt.compare(password, mentor.password))){
        console.log(mentor + " Logged in");
        res.status(201).json({
            _id: mentor.id,
            firstname: mentor.firstname,
            lastname: mentor.lastname,
            email: mentor.email,
            password: mentor.password,
            number: mentor.number,
            domain: mentor.domain,
            subdomain: mentor.subdomain,
            certifications: mentor.certifications,
            experience: mentor.experience,
            github: mentor.github,
            token: generateToken(mentor._id)
        });
    }
    else{
        res.status(400)
        throw new Error('Error')
    }

})



//UPDATE
const updateMentor = asyncHandler( async (req, res) => {
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
  
    Mentor.findByIdAndUpdate(id, { firstname, lastname, email, password: hashPassword, number, domain, subdomain, certifications, experience, github }, { new: true })
      .then(mentor => res.json(mentor))
      .catch(err => res.json(err));
  });



//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}



//Exporting userController
module.exports = {
  signupMentor, loginMentor, updateMentor
}
