const { Schema, model, models, default: mongoose} = require("mongoose");

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    technicalSheet:String,
    createdAt: { type: Date, default: () => new Date() },
    isFeatured:{type:Boolean,default:false},
    oldPrice: Number,
    isSolde: { type: Boolean, default: false },
    isPopular:{ type: Boolean, default: false },
    Quantity:{type:Number,default:1}
  });
export const Product=models.Product || model('Product',ProductSchema)