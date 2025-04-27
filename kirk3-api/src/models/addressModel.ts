import mongoose from "mongoose";

export const AddressSchema = new mongoose.Schema({
  houseNumber: String,
  street: String,
  city: String,
  county: String,
  postcode: String,
  country: String,
});

export const AddressModel = mongoose.model("Addresses", AddressSchema);

