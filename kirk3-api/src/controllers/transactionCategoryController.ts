import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  createTransactionCategory,
  retrieveTransactionCategories,
  retrieveTransactionCategory,
  retrieveTransactionCategoryByCode,
  updateTransactionCategory,
  deleteTransactionCategory,
} from "../services/transactionCategoryService";


export const getTransactionCategories = async (req: Request, res: Response) => {
  const transactionCategories = await retrieveTransactionCategories();
  if (transactionCategories) {
    return res.status(StatusCodes.OK).json({message: "Transaction Categories fetched successfully", transactionCategories}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any transaction categories`});
};

export const getTransactionCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transactionCategory = await retrieveTransactionCategory(id);
  if (transactionCategory) {
    return res.status(StatusCodes.OK).json({message: "Transaction Category fetched successfully", transactionCategory}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any Transaction Category`});
};

export const insertTransactionCategory = async (req: Request, res: Response) => {
  const { name, description, code,} = req.body;
  if (!name || !description || !code) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'name, description and code are required.' });
  }

  // check for duplicates
  const duplicate = await retrieveTransactionCategoryByCode(code);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "Transaction Category with this code already exists",});
  }

  const transactionCategory = await createTransactionCategory(name, description, code);
  if (transactionCategory) {
    return res.status(StatusCodes.CREATED).json({success: "Transaction Category inserted successfully", transactionCategory});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not insert transaction category at this time`});
  }
};

export const editTransactionCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, code } = req.body;

  if (!name || !description || !code) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'name, description and code are required.'});
  }

  const transactionCategory = await updateTransactionCategory(id, { name, description, code });
  if (transactionCategory) {
    return res.status(StatusCodes.OK).json({success: "Transaction Category updated successfully", transactionCategory});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not update transaction category at this time`});
  }
};

export const removeTransactionCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  // check if it exists
  const itFound = await retrieveTransactionCategory(id);;
  if (!itFound) {
    return res.status(StatusCodes.CONFLICT).json({message: "Transaction Category does not exist",});
  }
  await deleteTransactionCategory(id);
  return res.status(StatusCodes.OK).json({message: "Transaction Category deleted successfully"});
};
