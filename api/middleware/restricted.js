//JWT TOKEN
const {JWT_SECRET} = require("../auth/secrets")
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if (token == null) {
    res.status(401).json({message: "token required"})
    return
  }
  jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
    if(error) {
      res.status(401).json("token invalid")
      return
    }
    req.decodedToken = decodedToken
  })
  next();
};



  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */