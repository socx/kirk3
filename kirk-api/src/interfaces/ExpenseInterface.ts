import { ExpenseItem } from "./ExpenseItemInterface";

export interface BaseExpense {
  totalAmount: number;
  description: string;
  team: string;
  claimant: string;
  createdAt: string,
  paidAt: string,
  approvedAt: string,
  expenseItems: ExpenseItem[];
}

export interface Expense extends BaseExpense {
  expenseId : string
}
