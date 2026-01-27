const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Order item must have a product'],
        },
        quantity: {
          type: Number,
          required: [true, 'Order item must have a quantity'],
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Order item must have a price'],
          min: [0, 'Price cannot be negative'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Order must have a total amount'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
