const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error",
    details: err.details,
  });
};

export default errorHandler;

