import React, { useEffect, useState } from 'react';
import {useNavigate, } from 'react-router-dom';

import Layout from '../components/PrivateLayout';

import FinanceCategoriesTable from './FinanceCategories/FinanceCategoriesTable';
import { API_ROUTES } from '../lib/constants';
import { axiosPrivate } from '../lib/axios';

import useAuth from '../hooks/useAuth';
import SkeletonLoader from '../components/SkeletonLoader';


const FinanceCategories = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const defaultErrors = {
    name: { message: '' },
    code: { message: '' },
    description: { message: '' },
    formError: { message: '' },
  };

  const defaultCategory = {
    id: '',
    name: '',
    code: '',
    description: '',
  }

  const [accessToken, setAccessToken] = useState('');
  const [financeCategories, setFinanceCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(defaultCategory);
  const [errors, setErrors] = useState(defaultErrors);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    const token = getToken().accessToken;
    setAccessToken(token);
    async function fetchFinanceCategories() {
      await refreshFinanceCategories();
    }

    fetchFinanceCategories();
  },[]);

  useEffect(() => {
  },[currentCategory]);

  const validateField = (field) => {
    setErrors({...errors, [field.id]: {message : ''}});
    if((!field.value && !field.files) || field.files?.length <= 0) {
      setErrors({...errors, [field.id]: {message : `${field.id} is a required field!`}});
      return false;
    }
    return true;
  }

  const validateForm = () => {
    const { code, description, name } = currentCategory;
    let currentErrors = {...errors}
    if (!code.length > 0) {
      currentErrors = {...currentErrors, code: { message: 'code is required' }};
    }
    if (!description.length > 0) {
      currentErrors = {...currentErrors, description: { message: 'description is required' }};
    }
    if (!name.length > 0) {
      currentErrors = {...currentErrors, name: { message: 'name is required' }};
    }
    setErrors({...currentErrors});

    return code.length && description.length && name.length;
  }

  const refreshFinanceCategories = async () => {
    try {
      setIsBusy(true);
      const response = await axiosPrivate(accessToken).get(API_ROUTES.FINANCE_CATEGORIES_ENDPOINT);
      const data = response.data;

      if (data && data.financeCategories) {
        setFinanceCategories(data.financeCategories);
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
    setCurrentCategory({ ...currentCategory, [id]: value });
  }

  const onAddClick = async (event) => {
    try {
      event.preventDefault();
      setIsBusy(true);
      const { id, code, name, description, } = currentCategory;

      if (validateForm()) {
        const formData = new FormData();
        formData.append('code', code);
        formData.append('name', name);
        formData.append('description', description);
        const url = id ? `${API_ROUTES.FINANCE_CATEGORIES_ENDPOINT}/${id}` : API_ROUTES.FINANCE_CATEGORIES_ENDPOINT;
        const response = id
          ? await axiosPrivate(accessToken).patch(url, {code, name, description})
          : await axiosPrivate(accessToken).post(url, {code, name, description})
        const data = response.data;

        if (data && data.financeCategory && data.financeCategory.id) {
          await refreshFinanceCategories();
          setCurrentCategory(defaultCategory);
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

  const onEditItem = async (id) => {
    const item = financeCategories.find((i) => i.id == id);
    setCurrentCategory(item);
  }

  const onDeleteItem = async (id) => {
    const category = financeCategories.find((i) => i.id == id);
    setCurrentCategory(defaultCategory);
    await axiosPrivate(accessToken).delete(`${API_ROUTES.FINANCE_CATEGORIES_ENDPOINT}/${category.id}`);
    await refreshFinanceCategories();
  }


  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Finance Categories</h1>
          </div>
        </div>

        <div className="space-y-8 mb-5">
          <div className="grid gap-5 md:grid-cols-3">

            <div className="flex space-x-4">
              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="code">Code <span className="text-red-500">*</span></label>
                  <input id="code" className={`form-input w-full px-2 py-1  ${errors.code.message.length ? 'border-red-300' : ''}`}  type="text" value={currentCategory.code} maxLength={6} onChange={(e)=>onChangeInput(e)} />
                </div>
                {errors.code.message.length > 0 && <div className="text-xs mt-1 text-red-500">Code is required!</div>}
              </div>
              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input id="name" className={`form-input w-full px-2 py-1  ${errors.name.message.length ? 'border-red-300' : ''}`} type="text" value={currentCategory.name} maxLength={20} onChange={(e)=>onChangeInput(e)} />
                </div>
                {errors.name.message.length  > 0 && <div className="text-xs mt-1 text-red-500">Name is required!</div>}
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <input id="description" className={`form-input w-full px-2 py-1 border-red-300' ${errors.description.message.length ? 'border-red-300' : ''}`} type="text" value={currentCategory.description} maxLength={200} onChange={(e)=>onChangeInput(e)} />
              </div>
              {errors.description.message.length > 0 && <div className="text-xs mt-1 text-red-500">Description is required!</div>}
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <button
                  className="xs:w-1/4 text-sm btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white mt-5"
                  onClick={(e)=>onAddClick(e)}>
                    {currentCategory.id ? 'Update' : 'Add' }
                  </button>
              </div>
            </div>

          </div>
        </div>

        { isBusy ? (
          <SkeletonLoader type="rounded" count={3} height={30} width={100} />
        ) : (
          <FinanceCategoriesTable financeCategories={financeCategories} deleteCategory={onDeleteItem} editCategory={onEditItem} />
        )}

      </div>
    </Layout>
  );
}

export default FinanceCategories;
