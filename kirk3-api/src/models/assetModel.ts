import mongoose from "mongoose";

import { AddressSchema } from "./addressModel";
import { BusinessEntitySchema } from "./businessEntityModel";
import { UserSchema } from "./userModel";


const AssetValueSchema = new mongoose.Schema({
  amount: Number,
  valuationDate: Date,
});

const InvestmentSchema = new mongoose.Schema({
  depositAmount: Number,
  fees: Number,
  enhancementCosts: Number,
  financeAdvance: Number,
});

const ShareholdingSchema = new mongoose.Schema({
  shareholder: BusinessEntitySchema,
  holding: Number,
});

const PeriodicIncomeSchema = new mongoose.Schema({
  amount: Number,
  periodType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] ,
    default: 'Monthly'
  }
});


export const AssetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    acquisitionDate: Date,
    acquisitionPrice: Number,
    address: AddressSchema,
    financeOutstanding: Number,
    financeProvider: BusinessEntitySchema,
    investment: InvestmentSchema,
    marketValue: AssetValueSchema,
    minimumEquity: Number,
    periodicIncome: PeriodicIncomeSchema,
    shareholders: [ShareholdingSchema],
    users: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    deletedAt: Date,
  },
);

export const AssetModel = mongoose.model("Assets", AssetSchema);
