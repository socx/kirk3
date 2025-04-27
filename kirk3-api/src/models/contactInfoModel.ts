import mongoose from "mongoose";

import { AddressSchema } from "./addressModel";

export const ContactInfoSchema = new mongoose.Schema({
  telephones: [Number],
  emails: [String],
  address: AddressSchema,
});

export const ContactInfoModel = mongoose.model("ContactInfo", ContactInfoSchema);
