const reviews = require("../db/data/test-data/reviews");
const {
  fetchReviewById,
  fetchReview,
  fetchReviewComments,
  checkIdExists,
  insertComment,
} = require("../Models/reviewModels");

const getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};

const getReviews = (req, res, next) => {
  fetchReview()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};

const getReviewComments = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewComments(review_id)
    .then((reviewComments) => {
      if (!reviewComments.length) {
        return checkIdExists(review_id);
      }
      res.status(200).send({ comments: reviewComments });
    })
    .then(() => {
      res.status(200).send({ comments: [] });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentById = (req, res, next) => {
  const { username, body } = req.body;
  const { review_id } = req.params;

  checkIdExists(review_id)
    .then(() => {
      return insertComment(username, body, review_id).then((comment) => {
        res.status(201).send({ comment: comment });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getReviewsById,
  getReviews,
  getReviewComments,
  postCommentById,
};
