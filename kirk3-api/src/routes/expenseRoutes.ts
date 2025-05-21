import express from "express";
import multer from 'multer';

import {
  approveExpense,
  insertExpense,
  removeExpense,
  editExpense,
  getExpense,
  getExpenses,
  payExpense,
} from "../controllers/expenseController";
import { fileStorage } from "../middlewares/fileUploadHandler";

const upload = multer({ storage: fileStorage('./receipts') });

export const expenseRouter = express.Router();

expenseRouter.post("/", upload.array('receipts'), insertExpense);
expenseRouter.patch("/:id", upload.array('receipts'), editExpense);
expenseRouter.get("/", getExpenses);
expenseRouter.get("/:id", getExpense);
expenseRouter.delete("/:id", removeExpense);
expenseRouter.patch("/approve/:id", approveExpense);
expenseRouter.patch("/pay/:id", payExpense);
