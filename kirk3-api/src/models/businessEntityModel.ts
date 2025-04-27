import mongoose from "mongoose";

import { ContactInfoSchema } from "./contactInfoModel";


export const BusinessEntitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactInfo: ContactInfoSchema,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
      type: Date,
    },
  },
);

export const BusinessEntityModel = mongoose.model("BusinessEntities", BusinessEntitySchema);
