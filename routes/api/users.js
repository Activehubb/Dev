const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// Bringing express validator
const { check, validationResult } = require('express-validator')
const User = require('../../modules/User')

// @route   GET api/users
// router.get('/', (req, res) => res.send('User Route'))
// @desc    Test route
// @access  Public


// @route   GET api/users
// @desc    Register user
// @access  Public
router.post('/', [
  check('name', 'Name is Required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password should be at least 6 chars long').isLength({min: 6})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  // Destructuring user info
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({email})
    // Verify if user exists
    if (user) {
      return res.status(400).json({errors: [{msg: 'User already exists'}]})
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      size: '200',
      rating: 'pg',
      default: 'mm'
    })

    // then we create instance of new user the object 
    user = new User({
      name, email, password, avatar
    })

    // we salt the password before hashing out
    const salt = await bcrypt.genSalt(10)
    // Encrypt user passwords with bcrypt
    user.password = await bcrypt.hash(password, salt)

    // then we save it to DB
    await user.save();

    //  then return the user jsonwebtoken
    const payload = {
      user: {
        id:user.id
      }
    }
    
    jwt.sign(
      payload,
      config.get('jwtToken'),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        console.log(token)
    })

    console.log(req.body)
    res.send('User Registered')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
module.exports = router;