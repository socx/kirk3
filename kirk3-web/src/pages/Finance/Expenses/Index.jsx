import React, { useEffect, useState } from 'react';
import {useNavigate, } from 'react-router-dom';

import DeleteButton from '../../../components/DeleteButton';
import Layout from '../../../components/PrivateLayout';
import PaginationClassic from '../../../components/PaginationClassic';
import SkeletonLoader from '../../../components/SkeletonLoader';
import ExpensesTable from './ExpensesTable';

import { API_ROUTES } from '../../../lib/constants';
import { axiosPrivate } from '../../../lib/axios';
import useAuth from '../../../hooks/useAuth';


const RECORDS_PER_PAGE = 6;

const Expenses = () => {

  const navigate = useNavigate();
  const { getToken } = useAuth();

  const defaultErrors = {
    totalAmount: { message: '' },
    description: { message: '' },
    team: { message: '' },
    claimant: { message: '' },
    formError: { message: '' },
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

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };


  useEffect(() => {
    const token = getToken().accessToken;
    setAccessToken(token);
    async function fetchExpenses() {
      await refreshExpenses();
    }
    fetchExpenses();
  },[]);

  useEffect(() => {
    setExpensesToShow(expenses);
  },[currentExpense, expenses]);

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
      const response = await axiosPrivate(accessToken).get(API_ROUTES.EXPENSES_ENDPOINT);
      const data = response.data;

      if (data && data.expenses) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      throw error;
    }
    finally {
      setIsBusy(false);
    }
  }

  const onChangeInput = (e) => {
    const { id, value, } = e.target;
    validateField(e.target);
    setCurrentExpense({ ...currentExpense, [id]: value });
  }

  const onAddClick = async (event) => {
    try {
      event.preventDefault();
      setIsBusy(true);
      const { expenseId, team, claimant, description, } = currentExpense;

      if (validateForm()) {
        const url = expenseId ? `${API_ROUTES.EXPENSES_ENDPOINT}/${expenseId}` : API_ROUTES.EXPENSES_ENDPOINT;
        const response = expenseId
          ? await axiosPrivate(accessToken).patch(url, {team, claimant, description})
          : await axiosPrivate(accessToken).post(url, {team, claimant, description})
        const data = response.data;

        if (data && data.expense && data.expense.expenseId) {
          setCurrentPage(1);
          await refreshExpenses();
          setCurrentExpense(defaultExpense);
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        navigate('/signin');
      }
    } finally {
      setIsBusy(false);
    }
  }

  const onEditItem = async (expenseId) => {
    const item = expenses.find((i) => i.expenseId == expenseId);
    setCurrentExpense(item);
  }

  const onDeleteItem = async (expenseId) => {
    const expense = expenses.find((i) => i.expenseId == expenseId);
    setCurrentExpense(defaultExpense);
    await axiosPrivate(accessToken).delete(`${API_ROUTES.EXPENSES_ENDPOINT}/${expense.expenseId}`);
    await refreshExpenses();
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


  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">

          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Expenses</h1>
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
          </div>

        </div>


        { isBusy ? (
          <SkeletonLoader type="rect" height={200} />
        ) : (
          <ExpensesTable
            expenses={getCurrentPageExpenses()}
            selectedItems={handleSelectedItems}
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
