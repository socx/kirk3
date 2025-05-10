import { Expense } from '../../interfaces/ExpenseInterface';
import { ExpenseItem } from '../../interfaces/ExpenseItemInterface';
import { ExpenseModel } from '../../database/models/ExpenseModel';
import { ExpenseItemModel } from '../../database/models/ExpenseItemModel';
import { UserModel } from '../../database/models/UserModel';


const getExpenseFromModel = (expenseModel: any) => {
  const { expenseId, totalAmount, description, claimant, expenseItems, status, team, createdAt, updatedAt, } = expenseModel

  const expense: Expense = {
    expenseId,
    totalAmount,
    description,
    claimant,
    status,
    team,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    expenseItems: [],
  }

  for (const expenseItemModel of (expenseItems as ExpenseItemModel[])) {
    const expenseItem = getExpenseItemFromModel(expenseItemModel)
    expense.expenseItems.push(expenseItem);
  }
  return expense;
}

const getExpenseItemFromModel = (expenseItemModel: any) => {
  const { expenseItemId, amount, description, document, expenseItemDate, expenseId, } = expenseItemModel

  const expenseItem: ExpenseItem = {
    expenseItemId,
    amount,
    description,
    document,
    expenseItemDate,
    expenseId,
  }
  return expenseItem;
}

export const createExpense = async (totalAmount: number, description: string, claimant: string, expenseItems: ExpenseItem[], team: string,)
  : Promise<Expense|null> => {
  const expenseModel = await ExpenseModel.create({
    totalAmount,
    claimant,
    description,
    status: 'NEW',
    team,
  });
  expenseModel.expenseItems = [];
  for (const expenseItem of expenseItems) {
    const { amount, description, document, expenseItemDate } = expenseItem;
    const expenseItemModel = await ExpenseItemModel.create({
      amount,
      description,
      document,
      expenseItemDate,
      expenseId: expenseModel.expenseId,
    });
    expenseModel.expenseItems.push(expenseItemModel);
  }
  return expenseModel ? getExpenseFromModel(expenseModel) : null;
}

export const retrieveExpenses = async () => {
  const expenses: Expense[] = [];
  const expenseModels = await ExpenseModel.findAll({
    include: [ExpenseItemModel],
    attributes: ['expenseId', 'totalAmount', 'description', 'claimant', 'status', 'team', 'createdAt', 'updatedAt'],
  });
  
  if (expenseModels && expenseModels.length) {
    for (let i = 0; i < expenseModels.length; i++) {
      expenses.push(getExpenseFromModel(expenseModels[i]));
    }
  }
  return expenses;
}

export const retrieveExpense = async (expenseId: string) => {
  const expenseModel = await ExpenseModel.findOne({
    where: { expenseId: expenseId },
    include: [ExpenseItemModel],
    attributes: ['expenseId', 'totalAmount', 'description', 'claimant', 'status', 'team', 'createdAt', 'updatedAt'],
  });
  return expenseModel ? getExpenseFromModel(expenseModel) : null;
}

// To test for duplicates (Maybe not enough)
export const retrieveExpenseByDetails = async (totalAmount: number, description: string, team: string, claimant: string) => {
  const expenseModel = await ExpenseModel.findOne({
    where: {
      totalAmount,
      claimant,
      description,
      team,
    }
  });
  return expenseModel ? getExpenseFromModel(expenseModel) : null;
}

export const updateExpense = async (expenseId: string, fieldsToUpdate: any) => {
  const expenseModel = await ExpenseModel.findByPk(expenseId);
  await expenseModel?.update({...fieldsToUpdate});
  expenseModel?.reload();
  return expenseModel ? getExpenseFromModel(expenseModel) : null;
}

export const deleteExpense = async (expenseId: string,) : Promise<void> => {
  const expense = await ExpenseModel.findByPk(expenseId);
  if (expense) {
    await expense.destroy();
  }
}
