import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  subject: string;
  message: string;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
