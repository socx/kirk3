import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { API_ROUTES } from '../lib/constants';
import axios, { getBaseUrl } from '../lib/axios';

import PublicHeader from '../components/PublicHeader';
import Toast from '../components/Toast';

import AuthImage from "../images/sign-in-01.png";
import AuthDecoration from '../images/auth-decoration.png';


const ActivateUserAccount = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [response, setResponse] = useState({ success: false, message: ''});
  const [toastErrorOpen, setToastErrorOpen] = useState(true);

  const handleSignInClick = () => navigate('/login');
  
  useEffect(() => {
    async function fetchData() {
      setToastErrorOpen(true);
      const token = searchParams.get('token')
      if (!token) {
        setResponse({
          success: false,
          message: "Invalid/Missing token; your account cannot be activated. Please contact the system administrator."
        });
        return;
      }
      const url = `${getBaseUrl()}${API_ROUTES.ACTIVATE_USER_ACCOUNT}`;
      const response = await axios.patch(url, { token });
      const activated = response.status === 200;
      setResponse({
        success: activated,
        message: activated ?
          'Your account is now active, please click the button below to sign in.' :
          'There was a problem activating your account. Please speak to App admin'
      });
    }
    fetchData();
  }, []);


  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">

            {/* Header */}
            <PublicHeader/>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">User Activation ✨</h1>
              <p>
                {
                  toastErrorOpen &&
                    <div className="mb-2">
                      <Toast type={response.success ? 'success' : 'error'} open={toastErrorOpen} setOpen={setToastErrorOpen} isClosable={false}>
                        {response.message}
                      </Toast>
                    </div>
                }
              </p>
              {
                response.success &&
                  <div className="flex justify-center mt-6">
                    <button onClick={handleSignInClick} className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap">Sign in</button>
                  </div>
              }
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={AuthImage} width="760" height="1024" alt="Authentication" />
          <img className="absolute top-1/4 left-0 -translate-x-1/2 ml-8 hidden lg:block" src={AuthDecoration} width="218" height="224" alt="Authentication decoration" />
        </div>

      </div>

    </main>
  );
}

export default ActivateUserAccount;
