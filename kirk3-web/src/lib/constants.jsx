export const API_ROUTES = {
  DOCUMENT_DOWNLOAD_ENDPOINT: '/files',
  EXPENSES_APPROVE_ENDPOINT: `/expenses/approve`,
  EXPENSES_ENDPOINT: `/expenses`,
  EXPENSES_PAY_ENDPOINT: `/expenses/pay`,
  EXPENSE_SAVE: `/expenses`,
  FINANCE_CATEGORIES_ENDPOINT: '/transaction-categories',
  GET_USER_PERMISSIONS: '/user-permissions',
  LOGIN: `/users/authenticate`,
  LOGOUT: `/users/logout`,
  REGISTER: `/users/register`,
};

export const EXPENSE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  PAID: 'Paid',
}

export const EXPENSE_ACTION = {
  APPROVE: 'Approve',
  DELETE: 'Delete',
  EDIT: 'Edit',
  PAY: 'Pay',
};
