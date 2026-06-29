import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  unit_price: string;
}

export interface ICart extends Document {
  cart_token: string;
  user: mongoose.Types.ObjectId | null;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    unit_price: { type: String, required: true },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    cart_token: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
);
// حوّل _id لـ id
cartSchema.set("toJSON", {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
export const Cart = mongoose.model<ICart>("Cart", cartSchema);
