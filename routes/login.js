var express = require("express");
var router = express.Router();
let jwt = require("jsonwebtoken");
let config = require("../config");
const conexion = require("../libs/MongoUtils");
const login = require("../controllers/login");
const md5 = require("js-md5");

/* GET users listing. */
router.post("/", function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    let encryptedpw = md5(password);

    login.sendPassword(username, (pword) => {
      if (!pword) {
        res.send({
          success: false,
          message: "User does not exist",
        });
      } else {
        if (encryptedpw === pword) {
          let token = jwt.sign({ username: username }, config.secret, {
            expiresIn: "24h",
          });
          login.actualizarToken(username, token);
          res.send({
            success: true,
            message: "Authentication success",
            token: token,
          });
        } else {
          res.send({
            success: false,
            message: "Username or password not valid",
          });
        }
      }
    });
  } else {
    res.send({
      success: false,
      message: "Username or password not valid",
    });
  }
});

module.exports = router;
