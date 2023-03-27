const db = require('../db/connection.js');

const fetchCategories = () =>{
    return db.query(`SELECT * FROM categories`)
    .then((result) => {
        return result.rows;
})
}
module.exports = fetchCategories