const express = require("express");
const getCategories = require("./Controllers/catergoryController.js");
const {
  getReviewsById,
  getReviews,
} = require("./Controllers/reviewController.js");
const {
  handlePSQL400s,
  handleCustomErrors,
} = require("./Controllers/errorHandlingControllers");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.use("/*", (req, res) => {
  res.status(404).send({
    message: "Route does not exist",
  });
});
app.use(handlePSQL400s, handleCustomErrors);

module.exports = { app };
