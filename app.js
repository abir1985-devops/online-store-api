const express = require('express');
const productRoutes = require('./routes/productRoutes');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const AppError = require('./utils/appError');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');


const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.send('Online Store API running');
});
/* ✅ HEALTH CHECK  */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// 404 handler 
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  // 1) Defaults
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Something went wrong';

  // 2) Mongoose: invalid ObjectId (CastError)
  // Example: /api/products/123 (not a valid mongo id)
  if (err.name === 'CastError') {
    statusCode = 400;
    status = 'fail';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 3) Mongoose: validation errors
  // Example: missing required field, min length, etc.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    status = 'fail';
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
  }

  // 4) MongoDB: duplicate key error (unique fields)
  // Example: duplicate email, duplicate product reference
  if (err.code === 11000) {
    statusCode = 400;
    status = 'fail';

    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    message = `Duplicate value for ${field}: "${value}". Please use another value.`;
  }

  res.status(statusCode).json({
    status,
    message,
  });
});




module.exports = app;
