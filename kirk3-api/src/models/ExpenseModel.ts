import mongoose from "mongoose";
import { randomUUID } from "crypto";

import { ExpenseItemModel } from './ExpenseItemModel';


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

const ExpenseSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
      immutable: true,
    },
    claimant: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    expenseItems: {
      type: [ExpenseItemSchema]
    },
    team: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: {
      type: Date,
    },
    paidAt: {
        type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
);

export const ExpenseModel = mongoose.model("Expenses", ExpenseSchema);
