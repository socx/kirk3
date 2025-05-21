import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { EmailDetails, EmailTemplateTypes, sendEmail } from '../services/emailService';
import {
  createExpense,
  retrieveExpenses,
  retrieveExpense,
  updateExpense,
  deleteExpense,
  retrieveExpenseByDetails,
 } from '../services/expenseService';
import { getUserFromToken, } from '../services/userServices';


export const getExpenses = async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);

  if (user) {
    let expenses = await retrieveExpenses();
    // TODO: implement more robust filtering
    expenses = expenses?.length ? expenses.filter((expense) => user.team === 'Leadership' || expense.team === user.team) : [];
    if (expenses) {
      return res.status(StatusCodes.OK).json({message: "Found expenses successfully", expenses});
    } else {
      return res.status(StatusCodes.NO_CONTENT).json({ message: 'No expenses found' });
    }
  }
  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not recognise user`});
};

export const insertExpense = async (req: Request, res: Response) => {
  try {
    // Get claimant from token
    const user = await getUserFromToken(req);
    if (user) {
      const claimant = user.fullname;

      let { description, expenseItems, team, } = req.body;
      expenseItems = JSON.parse(expenseItems);

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
      const duplicate = await retrieveExpenseByDetails(claimant, description, team, totalAmount);
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({message: "Expense with this details already exists. Please check and try again",});
      }

      // Create expense
      const expense = await createExpense(claimant, description, expenseItems, team, totalAmount);
      if (!expense) {
        return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not create Expense at this time`});
      }

      return res.status(StatusCodes.OK).json({message: 'Expense created successfully', expense});
    }
    return res.status(StatusCodes.BAD_REQUEST);
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
};

export const removeExpense = async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  const { id } = req.params;

  if (user) {
    const expense = await updateExpense(id, { deletedAt: Date.now()});
    if (expense) {
      return res.status(StatusCodes.OK).json({message: "Deleted expense successfully", expense}); 
    }
  }
  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not recognise user or expense`});
};

export const approveExpense = async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  const { id } = req.params;

  if (user) {
    const expense = await updateExpense(id, { approvedAt: Date.now()});
    if (expense) {
      return res.status(StatusCodes.OK).json({message: "Approved expense successfully", expense}); 
    }
  }
  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not recognise user or expense`});
};

export const editExpense = async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);

  if (user) {
    const { id } = req.params;
    const { amount, description, expenseDate } = req.body;
    const uploadedFiles = req.files as Express.Multer.File[];
    const receipts = uploadedFiles &&  uploadedFiles.length
      ? uploadedFiles.map((file: Express.Multer.File ) => file.filename)
      : [];
    const expense = await updateExpense(id, { amount, description, expenseDate, receipts });
    if (expense) {
      const attachments =  receipts.map((receipt) => {
        return {
          filename: receipt,
          path: process.cwd() + `/uploads/${receipt}`,
        }
      });
      const emailDetails : EmailDetails = {
        templateType: EmailTemplateTypes.ExpenseUpdated,
        user,
        attachments,
      }
      sendEmail(emailDetails);
      return res.status(StatusCodes.OK).json({message: "Expense updated successfully", expense}); 
    }
  }
  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not recognise user or expense`});
};

export const payExpense = async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({message : 'Could not recognise user'});
  }

  const { id } = req.params;
  const foundExpense = await retrieveExpense(id);
  if (!foundExpense || !foundExpense.approvedAt){
    return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find matching approved expense`});
  }

  const expense = await updateExpense(id, { paidAt: Date.now()});
  if (expense) {
    return res.status(StatusCodes.OK).json({message: "Paid expense successfully", expense}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not recognise or pay expense`});
};

export const getExpense = async (req: Request, res: Response) => {
  const user = await getUserFromToken(req);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({message : 'Could not recognise user'});
  }

  const { id } = req.params;
  const expense = await retrieveExpense(id);
  if (expense) {
    return res.status(StatusCodes.OK).json({message: "Found expense successfully", expense});
  }
  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find matching active expense`});

};
