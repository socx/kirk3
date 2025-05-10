export interface BaseExpenseItem {
  amount: number;
  description: string;
  document: string;
  expenseItemDate: Date;
  expenseId: string;
}

export interface ExpenseItem extends BaseExpenseItem {
  expenseItemId : string
}
