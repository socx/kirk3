import express from "express";
import multer from 'multer';

import {
  editExpense,
  getExpenses,
  getExpense,
  insertExpense,
  removeExpense,
} from "../controllers/expenseController";
import { fileStorageEngine } from "../middleware/fileUploadHandler";


const upload = multer({ storage: fileStorageEngine('./receipts') });

export const expenseRouter = express.Router();

expenseRouter.post("/", upload.array('receipts'), insertExpense as any);
expenseRouter.get("/", getExpenses as any)
expenseRouter.get("/:expenseId", getExpense as any)
expenseRouter.patch("/:expenseId", editExpense as any)
expenseRouter.delete("/:expenseId", removeExpense as any)
