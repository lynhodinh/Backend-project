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

const fetchReview = () => {
  const sql = `
  SELECT
      reviews.owner,
      reviews.title,
      reviews.review_id,
      reviews.category,
      reviews.review_img_url,
      reviews.created_at,
      reviews.votes,
      reviews.designer,
      Count(comments.review_id) as comment_count
      FROM
      reviews
    LEFT JOIN
      comments
    ON
      reviews.review_id=comments.review_id
    GROUP BY
      reviews.review_id
    ORDER BY
      reviews.created_at DESC;
  `;
  return db.query(sql).then((result) => {
    return result.rows;
  });
};

const checkIdExists = (review_id) => {
  const sql = `
SELECT * FROM reviews WHERE review_id = $1`;
  return db.query(sql, [review_id]).then((result) => {
    if (!result.rowCount) {
      return Promise.reject({ status: 404, message: "ID not found" });
    }
  });
};

const fetchReviewComments = (review_id) => {
  const sql = `
      SELECT
        *
      FROM
        comments
      WHERE
        review_id = $1
      ORDER BY
        created_at DESC
    `;
  return db.query(sql, [review_id]).then((result) => {
    return result.rows;
  });
};
module.exports = {
  fetchReviewById,
  fetchReview,
  fetchReviewComments,
  checkIdExists,
};
