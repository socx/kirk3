import React, { useEffect, useState } from 'react';


import Datepicker from '../../../components/Datepicker';
import FileInput from '../../../components/FileInput';
import Toast from '../../../components/Toast';



const ExpenseForm = ({
  currency,
  expense,
  handleFormSubmit,
  handleFormCancel,
}) => {

  const defaultErrors = {
    expenseDate: { message: '' },
    amount: { message: '' },
    description: { message: '' },
    itemDescription: { message: '' },
    documents: { message: '' },
    formError: { message: '' },
  };

  const defaultExpenseItem = {
    amount: '',
    description: '',
    documents: [],
  };

  const defaultExpense = {
    team: '',
    description: '',
    expenseItems: []
  };

  const [expenseItems, setExpenseItems] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(expense);
  const [currentExpenseItem, setCurrentExpenseItem] = useState(defaultExpenseItem);
  const [errors, setErrors] = useState(defaultErrors);
  const [toastErrorOpen, setToastErrorOpen] = useState(false);


  useEffect(() => {
    if (errors && errors.length) {
      setToastErrorOpen(true)
    }
  }, [errors])

  useEffect(() => {
    // TODO: currentExpenseItem  && expenseItems should be passed in as parameter and set in useState declaration
    setCurrentExpenseItem(currentExpenseItem);
    setExpenseItems(expenseItems);
  }, []);

  useEffect(() => {
    // TODO: Revisit the logic here, is it needed?
    setExpenseItems(expenseItems);
    setCurrentExpense(expense);
  }, [expense, currentExpenseItem, expenseItems]);

  const validateField = (field) => {
    setErrors({...errors, [field.id]: {message : ''}});
    if((!field.value && !field.files) || field.files?.length <= 0) {
      setErrors({...errors, [field.id]: {message : `${field.id} is a required field!`}});
      return false;
    }
    return true;
  }

  const hasErrors = () => {
    return errors.amount.length || errors.itemDescription.length || errors.documents.length
  }

  const onChangeInput = (e) => {
    const { id, value, } = e.target;
    validateField(e.target);
    setCurrentExpenseItem({...currentExpenseItem, [id]: value})
  }

  const onChangeFile = (e) => {
    if (e.length && e[0].lastModified) {
      const documents =  e[0];
      // If existing in the list update
      setCurrentExpenseItem({...currentExpenseItem, documents: [documents]});
    }
  }

  const onAddExpenseItem = (e) => {
    validateField(e.target);

    setCurrentExpense({
      ...currentExpense,
      totalAmount: currentExpense.totalAmount ?
        parseFloat(currentExpense.totalAmount) + parseFloat(currentExpenseItem.amount) :
        parseFloat(currentExpenseItem.amount)
    });
    setExpenseItems([...expenseItems, currentExpenseItem]);
    setCurrentExpenseItem({...defaultExpenseItem});
  }

  const onFormCancelClick = (event) => {
    setErrors(defaultErrors);
    setExpenseItems([]);
    setCurrentExpenseItem(defaultExpenseItem);
    if (handleFormCancel) {
      handleFormCancel();
    }
  }

  const onFormSubmitClick = (event) => {
    setErrors(defaultErrors);
    setCurrentExpense({...currentExpense, expenseItems});debugger
    if (handleFormSubmit) {
      handleFormSubmit(currentExpense, expenseItems);
    }
  }


  return (
    <>
      {/* Modal content */}
      <form onSubmit={(e) => {onFormSubmit(e);} }>
        <div className="px-5 py-4">
          {
            hasErrors() &&
              <div className="mb-2">
                <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
                  {errors.formError}
                </Toast>
              </div>
          }
          <div className="space-y-3">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description <span className="text-rose-500">*</span></label>
                <input
                  id="description"
                  className="form-input w-full dark:disabled:placeholder:text-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed shadow-none"
                  type="text"
                  required
                  value={currentExpense ? currentExpense.description : ''}
                  onChange={(e)=>onChangeInput(e)}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="team">Team <span className="text-rose-500">*</span></label>
                <input
                  id="team"
                  className="form-input w-full dark:disabled:placeholder:text-gray-600 disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed shadow-none"
                  type="text"
                  required
                  value={currentExpense ? currentExpense.team: ''}
                  onChange={(e)=>onChangeInput(e)}
                  disabled
                />
              </div>
            </div>

            <hr className='mt-4 mb-4'/>

            <div className="text-sm">
              <div className="font-medium text-gray-800 dark:text-gray-100 mb-3">Add Expenses Items and click Add</div>
            </div>

            <div className="grid gap-5 md:grid-cols-1">
              <div>
                <div>
                  <input
                    id="description"
                    className={`form-input w-full px-2 py-1 border-red-300' `}
                    type="text"
                    value={currentExpenseItem.description}
                    maxLength={200}
                    onChange={(e)=>onChangeInput(e)}
                    placeholder="Item Description"
                  />
                </div>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className='relative'>
                  {/* <label className="block text-sm font-medium mb-1" htmlFor="description">
                    Amount <span className="text-red-500">*</span>
                  </label> */}
                  <input
                    id="amount"
                    className={`form-input w-full pl-12 px-2 py-1 border-red-300' `}
                    type="text"
                    value={currentExpenseItem.amount}
                    maxLength={200}
                    onChange={(e)=>onChangeInput(e)}
                  />
                  <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
                    <span className="text-sm text-slate-400 dark:text-slate-500 font-medium px-3 ">{currency}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative">
                  <FileInput isRequired={false} fileList={currentExpenseItem.documents} onChange={(e)=>onChangeFile(e)} className="form-textarea w-full px-2 py-1" />
                </div>
                {/* <div className="text-xs mt-1 text-center">(pdf, jpg, jpeg, png, )</div> */}
                {errors.documents && <div className="text-xs mt-1 text-rose-500">{errors.documents.message}</div>}
                {!errors.documents && <div className="text-xs mt-1">Invoice/Receipts (pdf, jpg, png)</div>}
              </div>
            </div>

            <div className="flex flex-wrap justify-end space-x-2">
              
              <button
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  onAddExpenseItem(e);
                }}
              >
                Add Expense Item
              </button>
            </div>
          </div>

          <hr className='mt-4 mb-4'/>

          <div className="py-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700/60">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-700/60">
                  <tr>
                    <th className="px-2 first:pl-5 last:pr-5 py-1 whitespace-nowrap">
                      <div className="font-semibold text-left">Description</div>
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
                  {expenseItems && expenseItems.length > 0 &&
                    expenseItems.map(({description, amount, documents} , index) => {
                      return (
                        <tr className='border-b' key={index}>
                          <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                            <div>{description}</div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                            <div>{currency} {amount}</div>
                          </td>
                          <td className="px-2 first:pl-5 last:pr-5 py-1/2 whitespace-nowrap">
                            <div>{documents && `${documents.length} document(s)`}</div>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>

            </div>
          </div>
          

        </div>
        {/* Modal footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60">
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn-sm border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                onFormCancelClick();
              }}
            >
              Cancel
            </button>
            <button
              className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onFormSubmitClick();
              }}
            >
              Submit Expenses
            </button>
          </div>
        </div>
      </form>
    </>
  );

}

export default ExpenseForm;
