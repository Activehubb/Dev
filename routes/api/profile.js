const express = require('express');
const Profile = require('../../modules/Profile');
const User = require('../../modules/User');
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');
const { response } = require('express');


// @route   GET api/profile/me route
// @desc    Get current user profile
// @access  Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('name', ['name', 'avatar'])

    if (!profile) {
     return res.status(400).json({
        msg: "Profile doesn't exist"
      })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})


// @route   POST api/profile route
// @desc    Create or update current user profile
// @access  Private

router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedIn
  } = req.body

  // Build Profile object

  const profileFields = {}
  profileFields.user = req.user.id;
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim())

 

  // Build social objects
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (instagram) profileFields.social.instagram = instagram
  if (linkedIn) profileFields.social.linkedIn = linkedIn

  console.log(profileFields.social.instagram)

  try {
    let profile = await Profile.findOne({ user: req.user.id })
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true}
      )

      console.log('Profile Updated')
      return res.json(profile)
    }

    // Create a profile if profile not found
    profile = new Profile(profileFields)

    await profile.save()

    res.json(profile)
    console.log('Profile Created')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Internal Server Error')
  }

  // res.send('skills formatted')
})

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Internal Serevr Error')
  }
})

// @route     GET api/profile/user/:user_id
// @desc      Get profile by user ID
// @access    Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('name', ['name', 'avatar'])

     return (!profile) ? res.status(400).json({
      msg: 'Profile doesn\'t exist for the user'
    }) : res.json(profile)

  } catch (err) {
    console.error(err.message)
      if (err.kind === 'ObjectId') res.status(400).json({
        msg: 'Profile doesn\'t exist for the user'
      })
  }
})


// @route     DELETE api/profile
// @desc      Delete profile, user and post
// @access    Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts
    
    // Remove Profile
      await Profile.findOneAndRemove({ user: req.user.id })
    // Remove User
      await User.findOneAndRemove({ _id: req.user.id }) 
      res.json({ msg: 'User deleted'})

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Internal Server Error')
  }
})

// @route     PUT api/profile/experience
// desc       Update profile route
// @access    Private

router.put('/experience', [auth, [
  check('title', "Title is required").not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'from is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    title,
    company,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {
    title,
    company,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id})

    profile.experience.unshift(newExp)

    await profile.save()

    response.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})


module.exports = router 