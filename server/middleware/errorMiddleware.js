export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'An unexpected internal server error occurred.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};