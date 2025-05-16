export interface BaseExpenseItem {
  amount: number;
  description: string;
  document: string;
  expenseId: string;
}

export interface ExpenseItem extends BaseExpenseItem {
  expenseItemId : string
}
