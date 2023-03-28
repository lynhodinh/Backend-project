const db = require("../db/connection.js");

const fetchReviewById = (id) => {
  const sql = `SELECT * FROM reviews WHERE review_id = $1`;
  return db.query(sql, [id]).then((result) => {
    const inputIdReview = result.rows;
    if (inputIdReview[0] === undefined) {
      return Promise.reject({ status: 404, message: "Review ID not found" });
    }
    return inputIdReview[0];
  });
};
module.exports = fetchReviewById;
