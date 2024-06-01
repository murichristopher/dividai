import { Schema, model } from "mongoose";
import { IContact } from "../types";

const contactSchema = new Schema<IContact>({
  name: { type: String, required: false },
  phone_number: { type: String, required: true, unique: true },
  photo_url: { type: String, required: true },
}, { strict: true });

export const Contact = model<IContact>("Contact", contactSchema)

