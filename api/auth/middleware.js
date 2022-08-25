const Users = require("./model")

const checkIfUsernameTaken = (req, res, next) => {
    const {username} = req.body
    Users.findBy({"username": username}).first()
    .then((result) => {
        if(result) {
            res.status(422).json({message: "username taken"})
            return
        }
        next()
    })
}

const checkIfUsernamePasswordMissing = (req, res, next) => {
    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "username and password required" });
      return;
    }
    if (username.trim() === "" || password.trim() === "") {
      res.status(400).json({ message: "username and password required" });
      return;
    }
    next();
}

module.exports = {
    checkIfUsernameTaken,
    checkIfUsernamePasswordMissing
}

// if(req.body.username == null || typeof req.body.username !== "string" || req.body.username.trim() === "" || req.body.password == null || req.body.password.trim() === "") {
//     res.status(400).json({message: "username and password required"})
//     return
// }
// next()