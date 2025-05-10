import { ExpenseItem } from "./ExpenseItemInterface";

export interface BaseExpense {
  totalAmount: number;
  description: string;
  team: string;
  status: string;
  claimant: string;
  createdAt: string,
  updatedAt: string,
  expenseItems: ExpenseItem[];
}

export interface Expense extends BaseExpense {
  expenseId : string
}
