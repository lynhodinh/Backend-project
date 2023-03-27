const fetchCategories = require('../Models/catergoryModels.js');

const getCategories = (req, res, next) => {

  fetchCategories().then((categories) => {

res.status(200).send({categories : categories})
})
.catch((err)=>{
  next(err)
})
};
 

module.exports = getCategories