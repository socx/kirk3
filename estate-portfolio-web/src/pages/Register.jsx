import { useRef, useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import PublicHeader from '../components/PublicHeader';
import Toast from '../components/Toast';

import AuthImage from "../images/sign-in-01.png";
import AuthDecoration from '../images/auth-decoration.png';


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NAME_REGEX = /^[A-z][A-z- ]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const Register = () => {
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [fullname, setFullname] = useState('');
  const [validFullname, setValidFullname] = useState(false);
  const [fullnameFocus, setFullnameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [toastSuccessOpen, setToastSuccessOpen] = useState(true);
  const [toastErrorOpen, setToastErrorOpen] = useState(true);

  const [registeredUser, setRegisteredUser] = useState(null);

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

  useEffect(() => {
    setValidFullname(NAME_REGEX.test(fullname));
  }, [fullname])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword])

  useEffect(() => {
    setErrMsg('');
  }, [email, fullname, password, matchPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const json = await register({ email, password, fullname });
    setIsLoading(false);
    if (json.user) {
      setSuccess(true);
      setRegisteredUser(json.user);
      setEmail('');
      setPassword('');
      setMatchPassword('');
      setFullname('');
      setTeam('');
    } else {
      setErrMsg(json.message);
    }
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
              <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">{success ? 'Account Created' : 'Create your Account'}</h1>
              {/* Form */}
              {
                success &&
                  <div className="mb-2">
                    <Toast type="success" open={toastSuccessOpen} setOpen={setToastSuccessOpen}>
                      We have sent an email to {registeredUser.email}. Please following the instructions in the email to activate your account.
                    </Toast>
                  </div>
              }

              {
                errMsg &&
                  <div className="mb-2">
                    <Toast type="error" open={toastErrorOpen} setOpen={setToastErrorOpen}>
                      {errMsg}
                    </Toast>
                  </div>
              }
              <form onSubmit={handleSubmit} className={`${success ? 'hidden' : ''}`}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      ref={emailRef}
                      className="form-input w-full"
                      type="email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      aria-invalid={validEmail ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                    />
                  </div>
                  {emailFocus && !validEmail &&
                    <div className="text-xs mt-1 text-rose-500">
                      Must be a valid email address
                    </div>
                  }
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="fullname">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullname"
                      className="form-input w-full"
                      type="text"
                      onChange={(e) => setFullname(e.target.value)}
                      value={fullname}
                      aria-invalid={validFullname ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setFullnameFocus(true)}
                      onBlur={() => setFullnameFocus(false)}
                    />
                  </div>
                  {fullnameFocus && !validFullname &&
                    <div className="text-xs mt-1 text-rose-500">
                      Must be letters, hyphens are allowed
                    </div>
                  }
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input
                      id="password"
                      className="form-input w-full"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      aria-invalid={validPassword ? "false" : "true"}
                      aria-describedby="passwordnote"
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => setPasswordFocus(false)}
                    />
                  </div>
                  {passwordFocus && !validPassword &&
                    <div className="text-xs mt-1 text-rose-500">
                      Must include uppercase and lowercase letters, a number and a special character.
                    </div>
                  }

                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      className="form-input w-full"
                      type="password"
                      onChange={(e) => setMatchPassword(e.target.value)}
                      value={matchPassword}
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                    />
                  </div>
                  {matchFocus && !validMatch && <div className="text-xs mt-1 text-rose-500">Must match the first password input field.</div>}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isLoading || !validEmail || !validFullname || !validPassword || !validMatch ? true : false}
                    className={
                      isLoading || !validEmail || !validFullname || !validPassword || !validMatch 
                      ? "btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap disabled:border-slate-200 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed shadow-none"
                      : "btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3 whitespace-nowrap"}
                  >
                    { isLoading && 
                      <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                        <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    }
                    <span className="ml-2">{ isLoading ? "Submitting..." : "Submit"}</span>
                  </button>
                </div>
              </form>
              {/* Footer */}
              <div className="pt-5 mt-6 border-t border-gray-100 dark:border-gray-700/60" >
                <div className="text-sm">
                  {success ? 'Once your account is activated you can ' : 'Have an account? '}
                  <Link className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" to="/login">
                    Login
                  </Link>
                </div>
              </div>
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

export default Register;
