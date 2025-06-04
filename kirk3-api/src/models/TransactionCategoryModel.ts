import mongoose from "mongoose";
import { randomUUID } from "crypto";


const TransactionCategorySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
);

export const TransactionCategoryModel = mongoose.model("TransactionCategories", TransactionCategorySchema);
