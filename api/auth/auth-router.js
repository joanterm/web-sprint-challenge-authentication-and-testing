const router = require('express').Router();
//JWT TOKEN
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("./secrets")
//BCRYPT
const bcrypt = require("bcryptjs")
//MODEL
const Users = require("./model")
//MIDDLEWARE
const {
  checkIfUsernameTaken,
  checkIfUsernamePasswordMissing
} = require("./middleware")

//POST -> GENERATE HASH -> REGISTER USER
router.post('/register', checkIfUsernameTaken, checkIfUsernamePasswordMissing, (req, res) => {
  const {username, password} = req.body
  const hash = bcrypt.hashSync(password, 8)
  const user = {username: username, password: hash}
  Users.insert(user)
    .then((result) => {
      res.status(201).json({id: result.id, username: username, password: hash})
    })
    .catch((err) => {
      console.log(err)
    })
});

// server.js > auth endpoints > [POST] /api/auth/register [6] responds 
// with an error status code if username or password are not sent


//POST -> COMPARE HASH -> GENERATE SESSION TOKEN -> LOGIN
router.post('/login', checkIfUsernamePasswordMissing, (req, res) => {
  const {username, password} = req.body
  Users.findBy({"username": username}).first()
    .then((result) => {
      console.log(result)
      if(bcrypt.compareSync(password, result.password)) {
        const token = generateToken(result)
        res.status(200).json({message: `Welcome, ${username}`, token})
      } else {
        res.status(401).json({message: "invalid credentials"})
      }
    })
    .catch((err) => {
      console.log(err)
    })
});

//CREATE JWT TOKEN
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "8h"
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;


  /*
    -REGISTER-

    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

  /*
    -LOGIN- 

    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */