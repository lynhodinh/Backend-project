const handle500Statuses = (err, req, res, next) => {
    console.log(err);
    response.status(500).send("Server Error!");
  };
  
module.exports = { handle500Statuses }