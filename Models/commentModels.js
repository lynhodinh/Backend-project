const db = require("../db/connection.js");

const removeComment = (comment_id) => {
  const sql = `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
      `;

  return db.query(sql, [comment_id]).then((result) => {
    const deletedComment = result.rows[0];
    if (deletedComment === undefined) {
      return Promise.reject({
        status: 404,
        message: "Comment ID not found.",
      });
    }
    return deletedComment;
  });
};
module.exports = { removeComment };
