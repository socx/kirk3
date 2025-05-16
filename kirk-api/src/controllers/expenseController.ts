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
import { getUserFromToken } from "../services/mysql/userServices";


export const getExpenses = async (req: Request, res: Response) => {
  const expenses = await retrieveExpenses();
  if (expenses) {
    return res.status(StatusCodes.OK).json({message: "Expenses fetched successfully", expenses}); 
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
  let { description, expenseItems, team, } = req.body;
  expenseItems = JSON.parse(expenseItems);

  // Get claimant from token
  const token = req.body.token || (req.get("Authorization") || "").replace("Bearer ", "");
  const user = await getUserFromToken(token);
  const  claimant = user?.id;
  

  if ( !description || !expenseItems || !expenseItems.length || !team || !claimant) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Missing parameter in request; must have totalAmount, claimant, description, expenseItems and team.' });
  }

  // Calculate Total amount
  let totalAmount = 0;
  for (const expenseItem of expenseItems) {
    totalAmount = expenseItem.amount ?
      totalAmount + parseFloat(expenseItem.amount) :
      totalAmount;
  }

  // Get uploaded files
  const uploadedFiles = req.files as Express.Multer.File[];
  const receipts = uploadedFiles &&  uploadedFiles.length
    ? uploadedFiles.map((file: Express.Multer.File, index: number ) => {return {filename: file.filename, documents: expenseItems[index]}})
    : [];

  // Set document for expense items
  let index = 0;
  for (const receipt of receipts) {
    expenseItems[index].document =  receipt.filename;
    index++;
  }

  // check for duplicates
  const duplicate = await retrieveExpenseByDetails(totalAmount, description, team, claimant);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "Expense with this details already exists. Please check and try again",});
  }

  // Create expense
  const Expense = await createExpense(totalAmount, description, claimant, expenseItems, team, );
  if (Expense) {
    return res.status(StatusCodes.CREATED).json({success: "Expense created successfully", Expense});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not create Expense at this time`});
  }
};

export const editExpense = async (req: Request, res: Response) => {
  const { expenseId } = req.params;
  const { claimant, description, expenseItems, team, } = req.body;
  // TODO: should get claimant from userId/token

  if (!description || !expenseItems || !expenseItems.length || !team || !expenseId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Missing required parameter.'});
  }

  // Calculate Total amount
  let totalAmount = 0;
  for (const expenseItem of expenseItems) {
    totalAmount = expenseItem.amount ?
      totalAmount + parseFloat(expenseItem.amount) :
      totalAmount;
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
