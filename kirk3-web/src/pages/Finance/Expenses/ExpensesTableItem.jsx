import React, { useState } from 'react';
import dayjs from 'dayjs';

import { truncateString } from '../../../utils/Utils';
import { EXPENSE_ACTION, EXPENSE_STATUS } from '../../../lib/constants';

import Approve from '../../../images/icons/approve.svg';
import Pay from '../../../images/icons/money-blue.svg'


const ExpensesTableItem = ({
  expenseId,
  totalAmount,
  description,
  claimant,
  status,
  team,
  approvedAt,
  createdAt,
  paidAt,
  expenseItems,
  handleClick,
  isChecked,
  handleExpenseAction
}) => {

  const [expenseItemsOpen, setExpenseItemsOpen] = useState(false);

  const getExpenseStatus = () => {
    if (paidAt) return EXPENSE_STATUS.PAID;
    if (approvedAt) return  EXPENSE_STATUS.APPROVED;
    return EXPENSE_STATUS.PENDING;
  }

  const statusColor = () => {
    switch (getExpenseStatus()) {
      case EXPENSE_STATUS.PAID:
        // return 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400';
        return 'bg-green-500/20 text-green-700';
      case EXPENSE_STATUS.APPROVED:
        // return 'bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400';
        return 'bg-yellow-500/20 text-yellow-700';
      default:
        // return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
        return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
    }
  };


  return (
    <tbody className="text-sm">
      {/* Row */}
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <label className="inline-flex">
              <span className="sr-only">Select</span>
              <input id={expenseId} className="form-checkbox" type="checkbox" onChange={handleClick} checked={isChecked} />
            </label>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div>{dayjs(createdAt).format('DD/MM/YYYY')}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="font-medium text-gray-800 dark:text-gray-100">{truncateString(description, 40)}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="font-medium text-gray-800 dark:text-gray-100">{claimant}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left font-medium text-green-600">{totalAmount.toFixed(2)}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left font-medium text-sky-600">{team}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor()}`}>{getExpenseStatus()}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 ${expenseItemsOpen && 'rotate-180'}`}
              aria-expanded={expenseItemsOpen}
              onClick={() => setExpenseItemsOpen(!expenseItemsOpen)}
              aria-controls={`description-${expenseId}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
            {getExpenseStatus() === EXPENSE_STATUS.PENDING &&
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 bg-slate-50 dark:bg-slate-700 rounded-full mr-2 sm:mr-3"
                onClick={(e) => { e.stopPropagation(); handleExpenseAction(expenseId, EXPENSE_ACTION.EDIT); }}
              >
                <span className="sr-only">Edit</span>
                <svg className="w-10 h-10 fill-current" viewBox="0 0 32 32">
                  <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                </svg>
              </button>
            }
            {getExpenseStatus() === EXPENSE_STATUS.PENDING &&
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                onClick={(e) => { e.stopPropagation(); handleExpenseAction(expenseId, EXPENSE_ACTION.APPROVE); }}
              >
                <span className="sr-only">Approve</span>
                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full mr-2 sm:mr-3">
                  <img className="ml-1" src={Approve} width="20" height="20" title="approve expense" alt="approve expense" />
                </div>
              </button>
            }
            {getExpenseStatus() === EXPENSE_STATUS.APPROVED &&
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full "
                onClick={(e) => { e.stopPropagation(); handleExpenseAction(expenseId, EXPENSE_ACTION.PAY); }}
              >
                <span className="sr-only">Pay</span>
                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full mr-2 sm:mr-3">
                  <img className="ml-1" src={Pay} width="20" height="20" title="pay expense" alt="pay expense" />
                </div>
              </button>
            }
            <button
              className="text-red-500 hover:text-red-600 bg-slate-100 dark:bg-slate-700 rounded-full mr-2 sm:mr-3"
              onClick={(e) => { e.stopPropagation(); handleExpenseAction(expenseId, EXPENSE_ACTION.DELETE); }}
            >
              <span className="sr-only">Delete</span>
              <svg className="w-10 h-10 fill-current" viewBox="0 0 32 32">
                <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
              </svg>
            </button>

          </div>
        </td>
      </tr>
      {/*
      Example of content revealing when clicking the button on the right side:
      Note that you must set a "colSpan" attribute on the <td> element,
      and it should match the number of columns in your table
      */}
      <tr id={`description-${expenseId}`} role="region" className={`${!expenseItemsOpen && 'hidden'}`}>
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <section className="ml-5 mr-5" >
            <table className="table-auto w-full dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700/60">
              <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700/60">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                    <div className="font-semibold text-left">Description</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                    <div className="font-semibold text-left">Date</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                    <div className="font-semibold text-left">Amount</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                    <div className="font-semibold text-left">Invoice/Receipt</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700/60">
                {expenseItems && expenseItems.length > 0 && expenseItems.map(({amount, description, expenseItemDate, expenseItemId, document}, index) => {
                  return (
                    <tr className='border-b' key={index}>
                      <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                        <div>{description}</div>
                      </td>
                      <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                        <div>{dayjs(expenseItemDate).format('DD/MM/YYYY')}</div>
                      </td>
                      <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                        <div>{amount.toFixed(2)}</div>
                      </td>
                      <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                        <div className="flex items-center space-x-3 shrink-0 ">
                          <div className="w-1/2">
                            <a
                              className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                              href={`http://localhost:7070/receipts/${document}`}
                            >
                              <button className="p-1 btn w-full bg-white border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300">
                                <svg className="fill-current text-gray-600 dark:text-gray-700 shrink-0 rotate-180" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 4c-.3 0-.5.1-.7.3L1.6 10 3 11.4l4-4V16h2V7.4l4 4 1.4-1.4-5.7-5.7C8.5 4.1 8.3 4 8 4ZM1 2h14V0H1v2Z" />
                                </svg>
                                <span className="ml-2 text-gray-600 dark:text-gray-700"> Download</span>
                              </button>
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </td>
      </tr>
    </tbody>
  );
}

export default ExpensesTableItem;
