const express = require("express");
const endpoints = require("./endpoints.json");
const getCategories = require("./Controllers/catergoryController.js");
const {
  getReviewsById,
  getReviews,
  getReviewComments,
  postCommentById,
  patchReviewVotes,
} = require("./Controllers/reviewController.js");
const { getUsers } = require("./Controllers/userController.js");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500s,
} = require("./Controllers/errorHandlingControllers");

const { deleteComment } = require("./Controllers/commentController.js");

const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json(endpoints);
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id", getReviewsById);

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", deleteComment);

app.use("/*", (req, res) => {
  res.status(404).send({
    message: "Route does not exist",
  });
});
app.use(handlePSQL400s, handleCustomErrors, handle500s);

module.exports = { app };
