const jwt = require("jsonwebtoken");
const config = require("./config");
const client = require("./controllers/client");

const checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid",
          });
        } else {
          req.decoded = decoded;
          client.sendRole(token, (role) => {
            if (role) {
              if (role === "admin" || role === "listar") {
                next();
              } else {
                res.send({
                  success: false,
                  message:
                    "User not authorized to access the information required",
                });
              }
            } else {
              res.send({
                success: false,
                message: "No user with the provided token.",
              });
            }
          });
        }
      });
    }
  } else {
    res.send({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

const checkTokenCreate = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Invalid token",
          });
        } else {
          req.decoded = decoded;
          client.sendRole(token, (role) => {
            if (role) {
              if (role === "admin" || role === "crear") {
                next();
              } else {
                res.send({
                  success: false,
                  message: "User not authorized to complete this action",
                });
              }
            } else {
              res.send({
                success: false,
                message: "No user with the provided token.",
              });
            }
          });
        }
      });
    }
  } else {
    res.send({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};

module.exports = {
  checkToken,
  checkTokenCreate,
};
