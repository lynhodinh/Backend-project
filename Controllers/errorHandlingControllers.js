const handlePSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid ID input" });
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
