import React, { useEffect, useState } from 'react';
import {useNavigate, } from 'react-router-dom';


import DeleteButton from '../../../components/DeleteButton';
import ModalBasic from '../../../components/ModalBasic';
import ModalBlank from '../../../components/ModalBlank';
import Layout from '../../../components/PrivateLayout';
import PaginationClassic from '../../../components/PaginationClassic';
import SkeletonLoader from '../../../components/SkeletonLoader';

import ExpenseActionConfirmation from './ExpenseActionConfirmation';
import ExpenseForm from './ExpenseForm';
import ExpensesTable from './ExpensesTable';

import { API_ROUTES, EXPENSE_ACTION } from '../../../lib/constants';
import { axiosPrivate } from '../../../lib/axios';
import useAuth from '../../../hooks/useAuth';


const RECORDS_PER_PAGE = 6;

const TEAMS = [
  { name: 'Media' },
  { name: 'Leadership' },
  { name: 'Worship' },
]

const Expenses = () => {

  const navigate = useNavigate();
  const { auth, getToken, logout } = useAuth();
  const { id } = auth; 

  const defaultErrors = {
    totalAmount: '',
    description: '',
    team: '',
    claimant: '',
    formError: '',
  };

  const defaultExpense = {
    id: '',
    totalAmount: '',
    description: '',
    team: '',
    claimant: '',
    expenseItems: [],
  }

  const [accessToken, setAccessToken] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(defaultExpense);
  const [errors, setErrors] = useState(defaultErrors);
  const [isBusy, setIsBusy] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesToShow, setExpensesToShow] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [expenseAction, setExpenseAction] = useState('');
  const [createExpenseModalOpen, setCreateExpenseModalOpen] = useState(false);
  const [expenseActionModalOpen, setExpenseActionModalOpen] = useState(false);

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };


  useEffect(() => {
    setAccessToken(getToken()?.accessToken);
    async function fetchExpenses() {
      await refreshExpenses();
    }
    fetchExpenses();
  }, []);

  useEffect(() => {
    setExpensesToShow(expenses);
  }, [currentExpense, expenses]);

  const validateField = (field) => {
    setErrors({...errors, [field.id]: {message : ''}});
    if((!field.value && !field.files) || field.files?.length <= 0) {
      setErrors({...errors, [field.id]: {message : `${field.id} is a required field!`}});
      return false;
    }
    return true;
  }

  const validateForm = () => {
    const { claimant, description, team } = currentExpense;
    let currentErrors = {...errors}
    if (!claimant.length > 0) {
      currentErrors = {...currentErrors, claimant: { message: 'claimant is required' }};
    }
    if (!description.length > 0) {
      currentErrors = {...currentErrors, description: { message: 'description is required' }};
    }
    if (!team.length > 0) {
      currentErrors = {...currentErrors, team: { message: 'team is required' }};
    }
    setErrors({...currentErrors});

    return claimant.length && description.length && team.length;
  }

  const refreshExpenses = async () => {
    try {
      setIsBusy(true);
      const response = await axiosPrivate(getToken()?.accessToken).get(API_ROUTES.EXPENSES_ENDPOINT);
      const data = response.data;

      if (data && data.expenses) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      if (error.response.status === 401) {
        logout();
        navigate('/signin');
      }
    }
    finally {
      setIsBusy(false);
    }
  }

  const onChangeInput = (e) => {
    const { id, value, } = e.target;
    console.log({value, id});
    validateField(e.target);
    setCurrentExpense({ ...currentExpense, [id]: value });
  }

  const onAddClick = async (event) => {
    try {
      event.preventDefault();
      setIsBusy(true);
      event.stopPropagation();

      if (currentExpense && currentExpense.description && currentExpense.team && currentExpense.team !== 'Select Team') {
        console.log({currentExpense});
        setCreateExpenseModalOpen(true);
      }
    } catch (err) {
      if (err.response.status === 401) {
        navigate('/signin');
      }
    } finally {
      setIsBusy(false);
    }
  }

  const handleExpenseAction  = async (expenseId, action) => {
    const item = expenses.find((i) => i.expenseId == expenseId);
    setCurrentExpense(item);
    setExpenseAction(action);
    switch (action.toLowerCase()) {
      case 'approve': 
        setExpenseActionModalOpen(true);
        break
      case 'pay':
        setExpenseActionModalOpen(true);
        break;
      case 'edit':
        setCreateExpenseModalOpen(true);
        break;
      case 'delete':
        setExpenseActionModalOpen(true);
        break;
    }
  }

  const handleExpenseActionConfirm = async (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log({currentExpense, action});
      switch(action) {
        case EXPENSE_ACTION.DELETE:
          await axiosPrivate(accessToken).delete(`${API_ROUTES.EXPENSES_ENDPOINT}/${currentExpense.expenseId}`);
          break;
        case EXPENSE_ACTION.APPROVE:
          await axiosPrivate(accessToken).patch(`${API_ROUTES.EXPENSES_APPROVE_ENDPOINT}/${currentExpense.expenseId}`);
          break;
        case EXPENSE_ACTION.PAY:
          await axiosPrivate(accessToken).patch(`${API_ROUTES.EXPENSES_PAY_ENDPOINT}/${currentExpense.expenseId}`);
          break;
      }

      setExpenseActionModalOpen(false);
      setExpenseAction('');
      setCurrentExpense(defaultExpense);
      refreshExpenses();
    } catch(err) {
      console.log({err})
      navigate('/signin');
    }
  }

  const handleFormCancel = (e) => {
    e.preventDefault();
    setCurrentExpense(defaultExpense);
    setExpenseActionModalOpen(false);
    setCreateExpenseModalOpen(false);
  }

  const totalExpenses = expensesToShow && expensesToShow.length ? expensesToShow.length : 0;
  const itemsPerPage = RECORDS_PER_PAGE < totalExpenses ? RECORDS_PER_PAGE : totalExpenses;
  
  const getCurrentPageExpenses = () => {
    const firstIndex = ((currentPage - 1) * itemsPerPage);
    const lastIndex = firstIndex + itemsPerPage < totalExpenses ?  firstIndex + itemsPerPage - 1 : totalExpenses - 1;
    const items = []; for(let i = firstIndex; i <= lastIndex; i++) items.push(i);
    return expensesToShow.filter((expense, index) => index >= firstIndex && index <= lastIndex);
  }

  const onPreviousPageButtonClick = () => {
    setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1);
  }

  const onNextPageButtonClick = () => {
    let totalPages = Math.ceil(expensesToShow.length/RECORDS_PER_PAGE);
    setCurrentPage(currentPage === totalPages ? currentPage : currentPage + 1);
  }


  const handleFormSubmit = async (expense, expenseItems) => {
    try {
      setIsBusy(true);
      const { expenseId,  } = expense;
      const formData = new FormData();
      if (expense.expenseId) {
        formData.append('expenseId', expense.expenseId);
      }
      formData.append('description', expense.description);
      formData.append('team', expense.team);
      const expenseIms = [];
      for (const expenseItem of expenseItems) {
        formData.append('receipts', expenseItem.document[0]);
        expenseIms.push({...expenseItem, document: 'receipts'});
      }
      formData.append('expenseItems', JSON.stringify(expenseIms));

      // if (validateForm()) {
        const url = expenseId ? `${API_ROUTES.EXPENSES_ENDPOINT}/${expenseId}` : API_ROUTES.EXPENSES_ENDPOINT;
        const response = expenseId
          ? await axiosPrivate(accessToken).patch(url, formData)
          : await axiosPrivate(accessToken).post(url, formData)
        const data = response.data;

        if (data && data.expense && data.expense.expenseId) {
          setCurrentPage(1);
          await refreshExpenses();
          setCurrentExpense(defaultExpense);
        }
      // }
    } catch (err) {
      if (err.response.status === 401) {
        navigate('/signin');
      }
    } finally {
      setIsBusy(false);
    }
  }


  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">

          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Expenses</h1>
          </div>

          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Create expense button */}
            {!isBusy  ? (
                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={(e) => { e.stopPropagation(); setCreateExpenseModalOpen(true); }}>
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">New Expenses</span>
                </button>
              ) : (
                <SkeletonLoader type="rect" count={1} height={40} width={100} />
              )
            }

            <ModalBasic id="expense-modal" modalOpen={createExpenseModalOpen} setModalOpen={setCreateExpenseModalOpen} title="New Expenses">
              <ExpenseForm
                currency={import.meta.env.VITE_DEFAULT_CURRENCY}
                expense={currentExpense}
                handleFormSubmit={handleFormSubmit}
                handleFormCancel={handleFormCancel}
              />
            </ModalBasic>
          </div>
        </div>


        {/* More actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-5">

          {/* Left side */}
          { isBusy ? (
              <SkeletonLoader type="rounded" count={3} height={30} width={100} />
            ) : (
              <div className="mb-4 sm:mb-0">
                {/* <ul className="flex flex-wrap -m-1">
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-800 transition">All <span className="ml-1 text-gray-400 dark:text-gray-500">67</span></button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">Paid <span className="ml-1 text-gray-400 dark:text-gray-500">14</span></button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">Due <span className="ml-1 text-gray-400 dark:text-gray-500">34</span></button>
                  </li>
                  <li className="m-1">
                    <button className="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition">Overdue <span className="ml-1 text-gray-400 dark:text-gray-500">19</span></button>
                  </li>
                </ul> */}
              </div>
            )
          }

          {/* Right side */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Delete button */}
            <DeleteButton selectedItems={selectedItems} />
            {/* Dropdown */}
            {/* <DateSelect /> */}
            {/* Filter button */}
            {/* <FilterButton align="right" /> */}

            <ModalBlank id="action-expense-modal" modalOpen={expenseActionModalOpen} setModalOpen={setExpenseActionModalOpen}>
              <ExpenseActionConfirmation
                currency={import.meta.env.VITE_DEFAULT_CURRENCY}
                expense={{...currentExpense}}
                expenseAction={expenseAction}
                handleFormCancel={handleFormCancel}
                handleExpenseActionConfirm={handleExpenseActionConfirm}
              />
            </ModalBlank>
          </div>

        </div>


        <div className="space-y-8 mb-5">


          <div className="grid gap-5 md:grid-cols-4">

            <div>
              {/* Start */}
              <div>
                <input
                  id="description"
                  className="form-input w-full"
                  type="text"
                  placeholder="Expense Description"
                  maxLength={40}
                  required
                  value={currentExpense.description}
                  onChange={(e)=>onChangeInput(e)}
                />
              </div>
              {errors.description &&
                <div className={`text-xs mt-1 text-red-500 ${errors.description ? 'hidden' : ''}`}>Error text goes here!</div>
              }
              {/* End */}
            </div>

            <div>
              {/* Start */}
              <div>
                <select
                  id="team"
                  className="form-select w-full"
                  value={currentExpense.team}
                  onChange={(e)=>onChangeInput(e)}
                >
                  <option>Select Team</option>
                  {TEAMS.map(({name}, index) => {
                    return (
                      <option key={index}>{name}</option>
                    )
                  })}
                </select>
              </div>
              {errors.team &&
                <div className={`text-xs mt-1 text-red-500 ${errors.team ? 'hidden' : ''}`}>Error text goes here!</div>
              }
              {/* End */}
            </div>
            
              <div>
                <button
                  className="ml-4 w-1/2 text-sm btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  onClick={onAddClick}
                >
                    {currentExpense.currentExpenseId ? 'Update' : 'Add' }
                  </button>
              </div>

          </div>

        </div>



        { isBusy ? (
          <SkeletonLoader type="rect" height={200} />
        ) : (
          <ExpensesTable
            expenses={getCurrentPageExpenses()}
            selectedItems={handleSelectedItems}
            handleExpenseAction={handleExpenseAction}
          />
        )}

        <div className="mt-8">
          <PaginationClassic
            totalItems={totalExpenses}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            itemName={'expenses'}
            handlePreviousButtonClick={onPreviousPageButtonClick}
            handleNextButtonClick={onNextPageButtonClick}
            isBusy={isBusy}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Expenses;
