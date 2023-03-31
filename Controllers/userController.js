const { fetchUsers } = require("../Models/userModel.js");

const getUsers = (req, res, err) => {
  fetchUsers()
    .then((allUsers) => {
      res.status(200).send({ users: allUsers });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers };
