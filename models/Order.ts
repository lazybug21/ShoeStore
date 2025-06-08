import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  product: {
    productId: string;
    name: string;
    price: number;
    variants: Record<string, string>;
    quantity: number;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    status: 'approved' | 'declined' | 'error';
  };
  total: number;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  product: {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    variants: { type: Map, of: String },
    quantity: { type: Number, required: true }
  },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  payment: {
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    status: { type: String, enum: ['approved', 'declined', 'error'], required: true }
  },
  total: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
