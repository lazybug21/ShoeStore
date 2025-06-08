import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  variants: {
    type: string;
    options: string[];
  }[];
  inventory: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  variants: [{
    type: { type: String, required: true },
    options: [{ type: String, required: true }]
  }],
  inventory: { type: Number, required: true, default: 100 }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
