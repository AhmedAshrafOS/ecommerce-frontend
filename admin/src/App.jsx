import React, { useEffect, useState, } from 'react';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Routes, Route ,Navigate} from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import Admin from './pages/Admin';
import { ToastContainer ,Slide} from 'react-toastify';
import { getUserRoleFromToken } from './utils/jwtHelper';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

axios.defaults.withCredentials = true;
export const backendUrl = "http://localhost:8080/ecommerce-service/"; // Update this to your backend URL
console.log("Backend URL:", backendUrl);
export const currency = '$';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(getUserRoleFromToken(token) || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer 
      position="top-center"
      autoClose={2000}
      transition={Slide}
/>
      {token === '' ? (
        <Login setToken={setToken} setUserRole={setUserRole} />
      ) : (
        <>
          <NavBar setToken={setToken}  />
          <hr />
          <div className="flex w-full">
             <Sidebar userRole={userRole} />
            <div className="flex-1 mx-8 my-8 text-gray-700 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token}/>} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
                <Route
                  path="/admin"
                  element={getUserRoleFromToken(localStorage.getItem('token')) === 'ROLE_SUPER_ADMIN' ? <Admin/> : <Navigate to="/add" />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
