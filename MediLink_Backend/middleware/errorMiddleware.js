// centralized error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error(" Error Caught by Middleware:", err);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode || 500;
  
  let message = err.message || "Internal Server Error";
  let errors = undefined;

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = "Validation Error";
    errors = Object.values(err.errors).map((el) => el.message);
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err.name === "CastError") {
    message = `Resource not found with id of ${err.value}`;
  }

  // Handle MongoDB Duplicate Key Error (11000)
  if (err.code === 11000) {
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
