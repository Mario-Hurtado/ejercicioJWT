const conexion = require("../libs/MongoUtils");
const md5 = require("js-md5");

const sendClients = (req, res) =>
  conexion.then((client) => {
    client
      .db("usersdb")
      .collection("users")
      .find({})
      .toArray((err, data) => {
        res.send(data);
      });
  });

const sendRole = (token, callback) =>
  conexion.then((client) => {
    client
      .db("usersdb")
      .collection("users")
      .findOne({ token: token })
      .then((result) => {
        if (result) {
          callback(result.role);
        } else {
          callback(null);
        }
      });
  });

const postClient = (req, res) => {
  conexion.then((client) => {
    const user = {
      username: req.body.username,
      password: md5(req.body.password),
      role: req.body.role,
      token: "",
    };

    res.send(user);
    client.db("usersdb").collection("users").insertOne(user);
  });
};

module.exports = {
  sendClients,
  sendRole,
  postClient,
};
