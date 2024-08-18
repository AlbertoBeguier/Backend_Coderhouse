import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
  timestamps: true 
});

// Middleware pre para populate automático
cartSchema.pre("findOne", function(next) {
  this.populate('products.product');
  next();
});

cartSchema.plugin(mongoosePaginate);

export const Cart = mongoose.model('Cart', cartSchema);


