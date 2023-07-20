const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var fetchuser=require('../middleware/fetchuser');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.REACT_APP_ACCESS_KEY;
//ROUTE 1: endpoint for creating user using POST : '/api/auth/createuser' No login required
router.post('/createuser', [
  body('name', 'Enter a valid Name').isLength({ min: 5 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password must be at least 5 Characters').isLength({ min: 5 })
], async (req, res) => {
  let sucess=false;
  // if there are errors , return Bad request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({sucess, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ sucess,error: "Sorry a user with this email already exixts" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      id: user.id
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    //console.log(jwtData);
    //res.json(user)
    sucess=true;
    res.json({sucess, authtoken })
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});
//ROUTE 2: Authenticate a user using:POST '/api/auth/login' No login required
router.post('/login', [
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let sucess=false;
  // if there are errors , return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      sucess=false;
      return res.status(400).json({ sucess,error: "Please login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      sucess=false;
      return res.status(400).json({sucess, error: "Please login with correct credentials" });
    }
    const data = {
      id: user.id
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    sucess=true;
    res.json({ sucess,authtoken })

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }

})
// ROUTE 3: Get loggedin user Detils using : POST 'api/auth/getuser' Login required
router.post('/getuser',fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
})

module.exports = router;
