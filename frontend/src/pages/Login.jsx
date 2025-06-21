import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios, { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const LOCK_DURATION_MS = 60000; // 60 seconds

const Login = () => {
  const { backendUrl, setToken, getUserCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const { search } = useLocation();

  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [lockedUser, setLockedUser] = useState(null);
  const [lockExpiry, setLockExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('expired')) {
      toast.info("Your session has expired");
    }
  }, [search]);

  useEffect(() => {
    if (!lockExpiry) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, lockExpiry - Date.now());
      setTimeLeft(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        setLockedUser(null);
        setLockExpiry(null);
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockExpiry]);

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      lockedUser &&
      lockedUser === credentials.usernameOrEmail.toLowerCase() &&
      Date.now() < lockExpiry
    ) {
      toast.warn(`Account is locked. Try again in ${timeLeft}s.`);
      return;
    }

    try {
      const resp = await axios.post(`${backendUrl}/auth/login`, credentials);

      if (resp.status === HttpStatusCode.Ok) {
        const token = resp.data.token;
        setToken(token);
        localStorage.setItem('token', token);
        toast.success('Logged in!');
        navigate('/');
      } else if (resp.status === HttpStatusCode.Forbidden) {
        toast.error(resp.data.message || 'Access forbidden');
      }

    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      
      if (status === HttpStatusCode.Locked) {
        // Account suspended
        toast.error('Account Suspended.Enter Email to reset your password.');
        setLockedUser(credentials.usernameOrEmail.toLowerCase());
        setLockExpiry(Date.now() + LOCK_DURATION_MS);
        setTimeLeft(60);
        navigate("/forgetpassword") 
      } else {
        console.log(message);
        
        toast.error(message);
      }
    }
  };

  // Redirect if already logged in
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

      {lockedUser &&
        lockedUser === credentials.usernameOrEmail.toLowerCase() &&
        Date.now() < lockExpiry && (
          <div>
          <div className="text-red-600 text-sm">
            This account is locked. Try again in {timeLeft}s.
          </div>
          <div>Account Suspended. Password reset email has been sent.</div>
          </div>

      )}

      <button
        type="submit"
        disabled={lockedUser === credentials.usernameOrEmail.toLowerCase() && Date.now() < lockExpiry}
        className={`w-full py-2 rounded transition ${
          lockedUser === credentials.usernameOrEmail.toLowerCase() && Date.now() < lockExpiry
            ? 'bg-gray-500 text-white cursor-not-allowed'
            : 'bg-black text-white hover:bg-red-600'
        }`}
      >
        Log In
      </button>

      <div className="flex flex-row justify-between items-center">
        <Link
          to="/forgetpassword"
          className="text-red-600 text-sm hover:underline"
        >
          Forgot your password?
        </Link>
        <div className="flex flex-col items-end">
          <p className="text-sm text-black">Don’t have an account?</p>
          <Link to="/signup" className="text-red-600 text-right text-sm hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Login;
