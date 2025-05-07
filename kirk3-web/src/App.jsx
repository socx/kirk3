import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

// import './charts/ChartjsConfig';

// Import pages
import ActivateUserAccount from './pages/ActivateUserAccount';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import PageNotFound from './pages/PageNotFound';
import Register from './pages/Register';



function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/activate-user-account" element={<ActivateUserAccount />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/utility/404" element={<PageNotFound />} />

          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/welcome" element={<Welcome />} />


          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
