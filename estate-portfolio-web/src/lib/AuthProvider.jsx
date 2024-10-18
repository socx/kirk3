import { createContext, useState, useMemo } from "react";

import { getBaseUrl, API_ROUTES } from "../lib/constants";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});debugger

  const login = async ({email, password}) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      };
      const authenticatePromise = await fetch(`${getBaseUrl()}${API_ROUTES.LOGIN}`, requestOptions);
      const json = await authenticatePromise.json();
      if (authenticatePromise.ok) {
        setAuth({ user: json.user });
        // TODO: Store in cookie
        return json;
      }
      return json;
    } catch (error) {
      return { message: 'Server error' };
    }
  }

  const logout = async () => {
    setAuth({...auth, user: null});
    await fetch(`${getBaseUrl()}${API_ROUTES.LOGOUT}`, { cache: 'no-store' })
  };

  const value = useMemo( () => ({
    auth, setAuth, login, logout,
  }), [auth]);
debugger
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
