import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import {
  createFinanceCategory,
  retrieveFinanceCategories,
  retrieveFinanceCategory,
  retrieveFinanceCategoryByCode,
  updateFinanceCategory,
  deleteFinanceCategory,
} from "../services/mysql/financeCategoryService";


export const getFinanceCategories = async (req: Request, res: Response) => {
  const financeCategories = await retrieveFinanceCategories();
  if (financeCategories) {
    return res.status(StatusCodes.OK).json({message: "Finance Categories fetched successfully", financeCategories}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any finance categories`});
};

export const getFinanceCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const financeCategory = await retrieveFinanceCategory(id);
  if (financeCategory) {
    return res.status(StatusCodes.OK).json({message: "Finance Category fetched successfully", financeCategory}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any financeCategory`});
};

export const insertFinanceCategory = async (req: Request, res: Response) => {
  const { name, description, code,} = req.body;
  if (!name || !description || !code) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'name, description and code are required.' });
  }

  // check for duplicates
  const duplicate = await retrieveFinanceCategoryByCode(code);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "Finance Category with this code already exists",});
  }

  const financeCategory = await createFinanceCategory(name, description, code);
  if (financeCategory) {
    return res.status(StatusCodes.CREATED).json({success: "Finance Category inserted successfully", financeCategory});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not insert financeCategory at this time`});
  }
};

export const editFinanceCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, code } = req.body;

  if (!name || !description || !code) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'name, description and code are required.'});
  }

  const financeCategory = await updateFinanceCategory(id, description);
  if (financeCategory) {
    return res.status(StatusCodes.OK).json({success: "FinanceCategory updated successfully", financeCategory});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not update finance category at this time`});
  }
};

export const removeFinanceCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  // check if it exists
  const itFound = await retrieveFinanceCategory(id);;
  if (!itFound) {
    return res.status(StatusCodes.CONFLICT).json({message: "Finance Category does not exist",});
  }
  await deleteFinanceCategory(id);
  return res.status(StatusCodes.OK).json({message: "Finance Category deleted successfully"});
};
