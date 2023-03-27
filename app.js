const express = require('express')
const getCategories = require('./Controllers/catergoryController.js')
const { handle500Statuses } = require('./Controllers/errorHandlingControllers')
const app = express();

app.get('/api/categories', getCategories);

app.use(handle500Statuses)

app.all("/*", (req, res) => {
    res.status(404).send({
      message: "Route does not exist",
    });
  });

module.exports = { app }