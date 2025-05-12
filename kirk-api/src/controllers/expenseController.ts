import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import {
  createExpense,
  retrieveExpenses,
  retrieveExpense,
  updateExpense,
  deleteExpense,
  retrieveExpenseByDetails,
} from "../services/mysql/expenseService";


export const getExpenses = async (req: Request, res: Response) => {
  const expenses = await retrieveExpenses();
  if (expenses) {
    return res.status(StatusCodes.OK).json({message: "Finance Categories fetched successfully", expenses}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any finance categories`});
};

export const getExpense = async (req: Request, res: Response) => {
  const { expenseId } = req.params;
  const expense = await retrieveExpense(expenseId);
  if (expense) {
    return res.status(StatusCodes.OK).json({message: "Expense fetched successfully", expense}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any expense`});
};

export const insertExpense = async (req: Request, res: Response) => {
  const { totalAmount, claimant, description, expenseItems, team, } = req.body;
  if (!totalAmount || !claimant || !description || !expenseItems || !team) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Missing parameter in request; must have totalAmount, claimant, description, expenseItems and team.' });
  }

  // check for duplicates
  const duplicate = await retrieveExpenseByDetails(totalAmount, description, team, claimant);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "Expense with this details already exists. Please check and try again",});
  }

  const Expense = await createExpense(totalAmount, description, claimant, expenseItems, team, );
  if (Expense) {
    return res.status(StatusCodes.CREATED).json({success: "Expense created successfully", Expense});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not create Expense at this time`});
  }
};

export const editExpense = async (req: Request, res: Response) => {
  const { expenseId } = req.params;
  const { totalAmount, claimant, description, expenseItems, team, } = req.body;

  if (!totalAmount || !claimant || !description || !expenseItems|| !team || !expenseId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Missing required parameter.'});
  }

  const Expense = await updateExpense(expenseId, { totalAmount, claimant, description, expenseItems, team, expenseId });
  if (Expense) {
    return res.status(StatusCodes.OK).json({success: "Expense updated successfully", Expense});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not update Expense at this time`});
  }
};

export const removeExpense = async (req: Request, res: Response) => {
  const { expenseId } = req.params;
  // check if it exists
  const itFound = await retrieveExpense(expenseId);;
  if (!itFound) {
    return res.status(StatusCodes.CONFLICT).json({message: "Expense does not exist",});
  }
  await deleteExpense(expenseId);
  return res.status(StatusCodes.OK).json({message: "Expense deleted successfully"});
};
