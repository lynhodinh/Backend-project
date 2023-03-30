const express = require("express");
const getCategories = require("./Controllers/catergoryController.js");
const {
  getReviewsById,
  getReviews,
  getReviewComments,
  postCommentById,
  patchReviewVotes,
} = require("./Controllers/reviewController.js");
const {
  handlePSQL400s,
  handleCustomErrors,
} = require("./Controllers/errorHandlingControllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postCommentById);

app.use("/*", (req, res) => {
  res.status(404).send({
    message: "Route does not exist",
  });
});
app.use(handlePSQL400s, handleCustomErrors);

module.exports = { app };
