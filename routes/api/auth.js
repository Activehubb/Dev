const express = require('express')
const router = express.Router()
const User = require('../../modules/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
// using the middleware
const auth = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
});

router.post('/', [
  check('email', 'Please enter valid email').isEmail(),
  check('password', 'Password is required').exists()
],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email })
      
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      const payload = {
        user: {
          id: user.id
        }
      }

       jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) console.log(err);
          res.json({ token })
        })
      
      console.log(req.body)
      console.log('User Login')
      // res.json(token);

    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)



module.exports = router