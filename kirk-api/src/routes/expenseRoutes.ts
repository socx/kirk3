import express from "express";

import {
  editExpense,
  getExpenses,
  getExpense,
  insertExpense,
  removeExpense,
} from "../controllers/expenseController";


export const expenseRouter = express.Router();

expenseRouter.post("/", insertExpense as any);
expenseRouter.get("/", getExpenses as any)
expenseRouter.get("/:expenseId", getExpense as any)
expenseRouter.patch("/:expenseId", editExpense as any)
expenseRouter.delete("/:expenseId", removeExpense as any)
