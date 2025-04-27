import React, { useEffect, useRef, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { API_ROUTES, } from '../lib/constants';
import { axiosPrivate, } from '../lib/axios';
import useAuth from '../hooks/useAuth';

import AuthImage from "../images/sign-in-01.png";

import PublicHeader from '../components/PublicHeader';
import Toast from '../components/Toast';

const Login = () => {
  const { getToken, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const emailRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastErrorOpen, setToastErrorOpen] = useState(true);


  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrorMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await login({email, password});
    setIsLoading(false);
    if (response.user) {
      setEmail('');
      setPassword('');
      const responseProperties = await axiosPrivate(getToken().accessToken).get(API_ROUTES.GET_USER_ASSETS);
      const navigateTo = getUserDestination(responseProperties.data.assets.length);
      navigate(navigateTo, { replace: true });
    } else {
      setErrorMsg(response.message);
    }
  }

  const getUserDestination = (numberOfProperties) => {
    const destination = location.state?.from?.pathname;
    return destination ? destination :  (numberOfProperties > 0 ? '/dashboard' : '/onboarding');
  }

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            {/* Header */}
            <PublicHeader/>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">Welcome back!</h1>
              {/* Form */}
              {
                errorMsg &&
                  <div className="mb-2">
                    <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
                      {errorMsg}
                    </Toast>
                  </div>
              }
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      className="form-input w-full"
                      type="email"
                      ref={emailRef}
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      className="form-input w-full"
                      type="password"
                      autoComplete="on"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="mr-1">
                      <Link className="text-sm underline hover:no-underline" to="/reset-password">
                        Forgot Password?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading ? true : false}
                      className={
                        isLoading 
                        ? "btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                        : "btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"}
                    >
                      { isLoading && 
                        <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                          <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                        </svg>
                      }
                      <span className="ml-2">{ isLoading ? "Please wait..." : "Login"}</span>
                    </button>
                  </div>
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-gray-100 dark:border-gray-700/60">
                <div className="text-sm">
                  You don’t have an account?{" "}
                  <Link className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" to="/register">
                    Register Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2" aria-hidden="true">
          <img className="object-cover object-center w-full h-full" src={AuthImage} width="760" height="1024" alt="Authentication" />
        </div>
      </div>
    </main>
  );
}

export default Login;
