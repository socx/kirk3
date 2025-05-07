import { createContext, useState, useMemo } from "react";

import { API_ROUTES } from "../lib/constants";
import { getBaseUrl } from "./axios";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const register = async ({ email, password, fullname }) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullname }),
      };
      
      const registerPromise = await fetch(`${getBaseUrl()}${API_ROUTES.REGISTER}`, requestOptions);
      const json = await registerPromise.json();
      return json;
    } catch (error) {
      return { message: 'Server error' };
    }
  }

  const login = async ({email, password}) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      };
      const url = `${getBaseUrl()}${API_ROUTES.LOGIN}`;
      const authenticatePromise = await fetch(url, requestOptions);
      const json = await authenticatePromise.json();
      if (authenticatePromise.ok) {
        setAuth({ user: json.user });
        localStorage.setItem('auth', JSON.stringify(json.user));
        return json;
      }
      return json;
    } catch (error) {
      return { message: 'Server error' };
    }
  }

  const getToken = () => {
    return JSON.parse(localStorage.getItem('auth'));
  }

  const logout = async () => {
    setAuth({...auth, user: null});
    localStorage.removeItem("auth");
    localStorage.removeItem("permissions");
    await fetch(`${getBaseUrl()}${API_ROUTES.LOGOUT}`, { cache: 'no-store' });
  };

  const getUserPermissions = async (userId) => {
    try {
      const url = `${getBaseUrl()}${API_ROUTES.GET_USER_PERMISSIONS}/${userId}`;
      const userPermissionsPromise = await fetch(url);
      const json = await userPermissionsPromise.json();
      if (userPermissionsPromise.ok) {
        setAuth({ userPermissions: json.userPermissions });
        localStorage.setItem('permissions', JSON.stringify(json.userPermissions));
        return json.userPermissions;
      }
      return json.userPermissions;
    } catch (error) {
      return { message: 'Server error' };
    }
  }

  const value = useMemo( () => ({
    auth, getToken, login, logout, register, setAuth, getUserPermissions,
  }), [auth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
