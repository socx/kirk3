import express from "express";

import {
  editTransactionCategory,
  getTransactionCategories,
  getTransactionCategory,
  insertTransactionCategory,
  removeTransactionCategory,
} from "../controllers/transactionCategoryController";


export const transactionCategoryRouter = express.Router();

transactionCategoryRouter.post("/", insertTransactionCategory as any);
transactionCategoryRouter.get("/", getTransactionCategories as any)
transactionCategoryRouter.get("/:id", getTransactionCategory as any)
transactionCategoryRouter.patch("/:id", editTransactionCategory as any)
transactionCategoryRouter.delete("/:id", removeTransactionCategory as any)
