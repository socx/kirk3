export interface ExpenseItem {
  expenseItemId: string,
  amount: number,
  description: string,
  document: string,
}

export interface BaseExpense {
  claimant: string,
  description: string,
  expenseItems: ExpenseItem[],
  team: string,
  totalAmount: number,
  createdAt: string,
  approvedAt?: string,
  paidAt?: string,
  deletedAt?: string,
}

export interface Expense extends BaseExpense {
  expenseId : string
}
