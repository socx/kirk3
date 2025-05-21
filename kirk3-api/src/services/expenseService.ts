import dayjs, { Dayjs } from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { Expense, ExpenseItem } from '../interfaces/ExpenseInterfaces';
import { ExpenseModel } from '../models/ExpenseModel';


dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const getExpenseFromModel = (expenseModel: any) => {
  const { _id, claimant, description, expenseItems, team, totalAmount, createdAt, approvedAt, paidAt, deletedAt} = expenseModel

  const expense: Expense = {
    expenseId: _id,
    totalAmount,
    description,
    claimant,
    team,
    createdAt: createdAt.toISOString(),
    approvedAt: approvedAt ? approvedAt.toISOString() : null,
    paidAt: paidAt ? paidAt.toISOString() : null,
    deletedAt: deletedAt ? deletedAt.toISOString() : null,
    expenseItems: []
  }

  for (const expenseItemModel of expenseItems) {
    const { _id, amount, description, document} = expenseItemModel;
    expense.expenseItems.push({
      expenseItemId: _id,
      amount,
      description,
      document
    });
  }
  return expense;
}

export const retrieveExpense = async (_id: string) => {
  const docExpense = await ExpenseModel.findOne({_id, deletedAt: null});
  return getExpenseFromModel(docExpense);
}

export const retrieveExpenses = async () : Promise<Expense[] | []> => {
  const expenses: Expense[] = [];
  const docExpenses = await ExpenseModel.find({deletedAt: null});
  docExpenses.forEach((docExpense) => {
    expenses.push(getExpenseFromModel(docExpense.toJSON()));
  });
  // sort by date
  const sortedExpenses = expenses.sort((a, b) =>  {
    if (dayjs(a.createdAt).isBefore(b.createdAt)) return 1;
    if (dayjs(b.createdAt).isBefore(a.createdAt)) return -1;
    return 0;
  })
  return sortedExpenses;
}

export const createExpense = async (
  claimant: string, description: string, expenseItems: [ExpenseItem], team: string, totalAmount: number, 
  ) : Promise<Expense> => {
    const expenseModel = await ExpenseModel.create({
      claimant,
      description,
      expenseItems,
      team,
      totalAmount,
    });

    return getExpenseFromModel(expenseModel);
}

// TODO: Rethink. This is surely not the best test for duplicates
export const retrieveExpenseByDetails = async (claimant: string, description: string, team: string, totalAmount: number,
) : Promise<Expense | null> => {
    const expenseModel = await ExpenseModel.findOne({
      claimant,
      description,
      team,
      totalAmount,
    });
    return expenseModel ? getExpenseFromModel(expenseModel) : null;
}

export const updateExpense = async (id: string, fieldsToUpdate: any
) : Promise<Expense | null> => {
    const expenseToUpdate = await ExpenseModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
    return expenseToUpdate ? getExpenseFromModel(expenseToUpdate) : null ;
}

export const deleteExpense = async (expenseId: string,) : Promise<void> => {
  await ExpenseModel.findByIdAndDelete(expenseId);
}
