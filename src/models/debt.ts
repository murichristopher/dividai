import { Schema, connect, model } from "mongoose";
import { IDebt } from "../types";

const debtorSchema = new Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  photo_url: { type: String, required: false }
}, { _id: false });

const creditorSchema = new Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  photo_url: { type: String, required: false }
}, { _id: false });

const debtSchema = new Schema<IDebt>({
  debtor: { type: debtorSchema, required: true },
  creditor: { type: creditorSchema, required: true },
  value: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
}, { strict: true });

export const Debt = model<IDebt>("Debt", debtSchema)

