const reviews = require("../db/data/test-data/reviews");
const {
  fetchReviewById,
  fetchReview,
  fetchReviewComments,
  checkIdExists,
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

module.exports = { getReviewsById, getReviews, getReviewComments };
