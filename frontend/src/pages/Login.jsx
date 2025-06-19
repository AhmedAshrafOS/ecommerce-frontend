import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const { backendUrl, setToken, getUserCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const handleChange = e => {
    setCredentials(c => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        `${backendUrl}/auth/login`,
        credentials
      );
      if (resp.status === HttpStatusCode.Ok) {
          const token = resp.data.token;
          setToken(token);
          localStorage.setItem('token', token);
          // await getUserCart(token);
          toast.success('Logged in!');
          navigate('/');
      }
      else if (resp.status === HttpStatusCode.Forbidden) {
        toast.error(resp.data.message || 'Access forbidden');

        }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 space-y-4 p-6 border rounded"
    >
      <h2 className="text-2xl font-semibold text-center">Log In</h2>

      <input
        name="usernameOrEmail"
        value={credentials.usernameOrEmail}
        onChange={handleChange}
        placeholder="Username or Email"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full border px-3 py-2 rounded"
      />


      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-red-600 transition"
      >
        Log In
      </button>


       <div className="flex flex-row justify-between items-center">
        <Link
          to="/forgot-password"
          className="text-red-600 text-sm hover:underline"
        >
          Forgot your password?
        </Link>
        <div justify-content="flex-end" className="flex flex-col items-end">
          <p className=" text-sm text-black">
            Don’t have an account?{' '}
         </p>
                 <Link to="/signup" className="text-red-600 text-right text-sm hover:underline">

          Sign up
        </Link>

        </div>

      </div>

    </form>
  );
};

export default Login;
