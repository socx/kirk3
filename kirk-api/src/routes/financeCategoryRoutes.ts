import express from "express";

import {
  getFinanceCategories,
  getFinanceCategory,
  insertFinanceCategory,
  removeFinanceCategory,
} from "../controllers/financeCategoryController";


export const financeCategoryRouter = express.Router();


financeCategoryRouter.post("/", insertFinanceCategory as any);
financeCategoryRouter.get("/", getFinanceCategories as any)
financeCategoryRouter.get("/:id", getFinanceCategory as any)
financeCategoryRouter.delete("/:id", removeFinanceCategory as any)
