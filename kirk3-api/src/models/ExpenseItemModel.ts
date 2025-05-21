import mongoose from "mongoose";
import { randomUUID } from "crypto";

const ExpenseItemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
      immutable: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
  },
);

export const ExpenseItemModel = mongoose.model("ExpenseItems", ExpenseItemSchema);
