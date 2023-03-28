const reviews = require("../db/data/test-data/reviews");
const { fetchReviewById, fetchReview } = require("../Models/reviewModels");

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

module.exports = { getReviewsById, getReviews };
