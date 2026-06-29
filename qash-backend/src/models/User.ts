import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  avatar: string | null;
  role: string;
  is_verified: boolean;
  verification_code: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    date_of_birth: { type: String, default: null },
    avatar: { type: String, default: null },
    role: { type: String, default: "user" },
    is_verified: { type: Boolean, default: false },
    verification_code: { type: String, default: null },
  },
  { timestamps: true },
);
// حوّل _id لـ id وأضف التواريخ بالصيغة الصح
userSchema.set("toJSON", {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});
export const User = mongoose.model<IUser>("User", userSchema);
