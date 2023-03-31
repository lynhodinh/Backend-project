const db = require("../db/connection.js");

const fetchUsers = () => {
  const sql = `
  SELECT * FROM users
  `;
  return db.query(sql).then((result) => {
    const allUsers = result.rows;
    return allUsers;
  });
};

module.exports = { fetchUsers };
