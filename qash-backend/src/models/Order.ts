import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | null;
  guest_email: string | null;
  items: IOrderItem[];
  shipping_address: {
    full_name: string;
    phone: string;
    address_line: string;
    city: string;
    country: string;
    postal_code: string;
  };
  payment_method: string;
  status: string;
  payment_status: string;
  subtotal: string;
  shipping_cost: string;
  discount: string;
  total_amount: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: String, required: true },
  total_price: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    guest_email: { type: String, default: null },
    items: { type: [orderItemSchema], default: [] },
    shipping_address: {
      full_name: { type: String, required: true },
      phone: { type: String, required: true },
      address_line: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postal_code: { type: String, default: "" },
    },
    payment_method: { type: String, default: "CASH_ON_DELIVERY" },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    payment_status: {
      type: String,
      enum: ["UNPAID", "PAID", "FAILED"],
      default: "UNPAID",
    },
    subtotal: { type: String, required: true },
    shipping_cost: { type: String, default: "0.00" },
    discount: { type: String, default: "0.00" },
    total_amount: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);
// حوّل _id لـ id في الـ JSON
// حوّل _id لـ id وأضف created_at
orderSchema.set("toJSON", {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
export const Order = mongoose.model<IOrder>("Order", orderSchema);
