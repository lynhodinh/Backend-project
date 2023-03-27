const express = require('express')
const getCategories = require('./Controllers/catergoryController.js')
const { handle500Statuses } = require('./Controllers/errorHandlingControllers')
const app = express();

app.get('/api/categories', getCategories);

app.use(handle500Statuses)

module.exports = { app }