import dayjs from "dayjs";

import { EXPENSE_STATUS, EXPENSE_ACTION }  from '../../../lib/constants';
import  { toTitleCase } from '../../..//utils/Utils';

import Image from '../../../images/transactions-image-04.svg';
import Approve from '../../../images/icons/approve.svg';
import Delete from '../../../images/icons/delete.svg';
import Pay from '../../../images/icons/money-blue.svg';

const ExpenseActionConfirmation = ({
  expenseAction,
  currency,
  expense,
  handleExpenseActionConfirm,
  handleFormCancel,
}) => {
  const expenseActionTheme = () => expenseAction === EXPENSE_ACTION.DELETE ? 'red' : 'indigo';

  const getExpenseStatus = () => {
    const { approvedAt, paidAt } = expense;
    if (paidAt) return EXPENSE_STATUS.PAID;
    if (approvedAt) return  EXPENSE_STATUS.APPROVED;
    return EXPENSE_STATUS.PENDING;
  }

  const getIcon = () => {
    switch (expenseAction) {
      case EXPENSE_ACTION.APPROVE:
        return Approve;
      case EXPENSE_ACTION.PAY:
        return Pay;
      case EXPENSE_ACTION.DELETE:
        return Delete;
      default:
        return Image;
    }
  };

  const getStatusColor = () => {
    switch (getExpenseStatus()) {
      case EXPENSE_STATUS.PAID:
        return 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400';
      case EXPENSE_STATUS.APPROVED:
        return 'bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="p-5 flex space-x-4">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-${expenseActionTheme()}-100 dark:bg-${expenseActionTheme()}-500/30`}>
        <svg className={`w-4 h-4 shrink-0 fill-current text-${expenseActionTheme()}-500`} viewBox="0 0 16 16">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
        </svg>
      </div>
      {/* Content */}
      <div>
        {/* Modal header */}
        <div className="mb-2">
          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{toTitleCase(`${expenseAction} expense?`)}</div>
        </div>
        {/* Modal content */}
        <div className="text-sm mb-10">
          <div className="py-2 px-4 lg:px-8">
            <div className="max-w-sm mx-auto lg:max-w-none">
              <div className="text-slate-800 dark:text-slate-100 font-semibold text-center mb-1">Are you sure you want to {expenseAction} this expense?</div>
              {/* Details */}
              <div className="drop-shadow-lg mt-12">
                {/* Top */}
                <div className="bg-white dark:bg-slate-700 rounded-t-xl px-5 pb-2.5 text-center">
                  <div className="mb-3 text-center">
                    <img className="inline-flex w-12 h-12 rounded-full -mt-6" src={getIcon(expenseAction)} width="48" height="48" alt="Transaction 04" />
                  </div>
                  <div className="text-2xl font-semibold text-emerald-500 mb-1">{currency} {expense.totalAmount && expense.totalAmount.toFixed(2)}</div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-3">{dayjs(new Date(expense.createdAt)).format('DD MMM YYYY')}</div>
                  <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${getStatusColor()}`}>{getExpenseStatus(expense)}</div>
                </div>
                {/* Divider */}
                <div className="flex justify-between items-center" aria-hidden="true">
                  <svg className="w-5 h-5 fill-white dark:fill-slate-700" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                  </svg>
                  <div className="grow w-full h-5 bg-white dark:bg-slate-700 flex flex-col justify-center">
                    <div className="h-px w-full border-t border-dashed border-slate-200 dark:border-slate-600" />
                  </div>
                  <svg className="w-5 h-5 fill-white dark:fill-slate-700 rotate-180" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                  </svg>
                </div>
                {/* Bottom */}
                <div className="bg-white dark:bg-slate-800 dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-700/70 rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                  <div className="flex justify-between space-x-1">
                    <span className="italic">Description:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-100 text-right">{expense.description}</span>
                  </div>
                  <div className="flex justify-between space-x-1">
                    <span className="italic">Claimant:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-100 text-right">{expense.claimant}</span>
                  </div>
                  <div className="flex justify-between space-x-1">
                    <span className="italic">Team:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-100 text-right">{expense.team}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>  
        </div>
        {/* Modal footer */}
        <div className="flex flex-wrap justify-end space-x-2">
          <button className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" onClick={(e) => { e.stopPropagation(); handleFormCancel(e); }}>Cancel</button>
          <button className={`btn-sm bg-${expenseActionTheme()}-${expenseActionTheme() === 'indigo' ? '500' : '100'} hover:bg-${expenseActionTheme()}-600 text-white`} onClick={(e) => { handleExpenseActionConfirm(e, expenseAction); }}> Yes,  {expenseAction} it</button>
        </div>
      </div>
    </div>
  ); 
}

export default ExpenseActionConfirmation;
