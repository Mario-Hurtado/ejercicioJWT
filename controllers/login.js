const conexion = require("../libs/MongoUtils");

const sendPassword = (username, callback) => {
  conexion.then((client) => {
    client
      .db("usersdb")
      .collection("users")
      .findOne({ username })
      .then((result) => {
        if (result) {
          callback(result.password);
        } else {
          callback(null);
        }
      });
  });
};

const actualizarToken = (username, token) => {
  conexion.then((client) => {
    client
      .db("usersdb")
      .collection("users")
      .updateOne({ username }, { $set: { token: token } });
  });
};

module.exports = {
  sendPassword,
  actualizarToken,
};
