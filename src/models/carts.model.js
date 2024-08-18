import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ]
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

export const Cart = mongoose.model('Cart', cartSchema);


