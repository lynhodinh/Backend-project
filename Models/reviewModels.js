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

const insertComment = (username, body, review_id) => {
  const sql = `
        INSERT INTO comments
        (author, body, review_id)
        VALUES
        ($1, $2, $3)
        RETURNING *;`;

  const checkUserSql = `
        SELECT * FROM users
        WHERE username = $1;
    `;

  return db.query(checkUserSql, [username]).then((userResult) => {
    if (userResult.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Username not found" });
    }

    if (!body) {
      return Promise.reject({ status: 400, message: "Please post a comment" });
    }

    return db.query(sql, [username, body, review_id]).then((commentResult) => {
      return commentResult.rows[0];
    });
  });
};

const updateReviewVotes = (review_id, votesToAdd) => {
  const sql = `
      UPDATE reviews
      SET
      votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`;
  return db.query(sql, [votesToAdd, review_id]).then((results) => {
    return results.rows;
  });
};

module.exports = {
  fetchReviewById,
  fetchReview,
  fetchReviewComments,
  checkIdExists,
  insertComment,
  updateReviewVotes,
};
