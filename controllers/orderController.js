const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// POST /api/orders
exports.createOrder = catchAsync(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must have at least one item', 400);
  }

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new AppError('One or more products are invalid', 400);
  }

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let totalAmount = 0;

  const orderItems = items.map((item) => {
    const product = productMap.get(item.product.toString());

    if (!item.quantity || item.quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    if (product.quantity < item.quantity) {
      throw new AppError(`Not enough stock for: ${product.name}`, 400);
    }

    totalAmount += product.price * item.quantity;

    return {
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    status: 'pending',
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    });
  }

  res.status(201).json({
    status: 'success',
    data: { order },
  });
});

// GET /api/orders/my
exports.getMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    'items.product',
    'name price'
  );

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders },
  });
});

// PATCH /api/orders/:id/status (admin only)
exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const allowed = ['pending', 'paid', 'shipped', 'cancelled'];
  if (!status || !allowed.includes(status)) {
    throw new AppError(`Status must be one of: ${allowed.join(', ')}`, 400);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate('user', 'name email role')
    .populate('items.product', 'name price');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

// GET /api/orders (admin only)
exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email role')
    .populate('items.product', 'name price');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders },
  });
});

// PATCH /api/orders/:id/cancel
exports.cancelMyOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('You do not have permission to cancel this order', 403);
  }

  if (order.status !== 'pending') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: item.quantity },
    });
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});
