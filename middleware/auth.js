const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = (req, res, next) => {
  // Get the Token form the header
  const token = req.header('x-auth-token')

  // check if no token
  if (!token) {
    return res.status(401).json({msg: 'No token, unauthorized access'})
  }

  // verify if token exist
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'))
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({msg: 'Token is not valid'})
   }
}