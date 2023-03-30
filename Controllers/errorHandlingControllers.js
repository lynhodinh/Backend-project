const handlePSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res
      .status(400)
      .send({
        message:
          "We were unable to process your request as it appears to be invalid. Please check your spelling and try again",
      });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  const { status, message } = err;
  if (status && message) {
    res.status(status).send({ message });
  }
  next(err);
};

module.exports = { handlePSQL400s, handleCustomErrors };
