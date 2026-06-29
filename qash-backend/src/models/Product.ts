import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  base_price: string;
  discount_price: string | null;
  has_discount: boolean;
  best_seller: boolean;
  thumbnail: string;
  images: string[];
  category: string;
  stock: number;
  in_stock: boolean;
  is_available: boolean;
  inventory_mode: string;
  available_variations: unknown[];
  available_combinations: unknown[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    name_ar: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
    description: {
      type: String,
      default: "A beautiful handcrafted piece for your home.",
    },
    description_ar: { type: String, default: "قطعة مصنوعة يدوياً لمنزلك." },
    base_price: { type: String, required: true },
    discount_price: { type: String, default: null },
    has_discount: { type: Boolean, default: false },
    best_seller: { type: Boolean, default: false },
    thumbnail: { type: String, default: "" },
    images: { type: [String], default: [] },
    category: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    in_stock: { type: Boolean, default: true },
    is_available: { type: Boolean, default: true },
    inventory_mode: { type: String, default: "simple" },
    available_variations: { type: [Schema.Types.Mixed], default: [] },
    available_combinations: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);
// حوّل _id لـ id في الـ JSON
productSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
export const Product = mongoose.model<IProduct>("Product", productSchema);
