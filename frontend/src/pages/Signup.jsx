import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Signup = () => {
  const { backendUrl, navigate, setToken } = useContext(ShopContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

      const registerPromise = axios.post(
          `${backendUrl}/auth/register`,
          form
        );

        // 2) hook it into toast.promise
        toast.promise(
          registerPromise,
          {
            pending: 'Creating account…',
            success: 'Account created!',
          }
        );
    try {
      const resp = await registerPromise
      navigate('/login');
    } catch (err) {
        const respon = Object.keys(JSON.parse(err.request.response))[0]  
      toast.error(err.response?.data?.message ||JSON.parse(err.request.response)[respon] ||err.message,{autoClose:8000});
    }
        setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  };

  useEffect(() => {
    // if already logged in
    if (localStorage.getItem('token')) navigate('/');
  }, [navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-4 p-6 border rounded"
    >
      <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-2 rounded hover:bg-red-600 transition disabled:bg-gray-500"
      >
        Sign Up
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-red-600 cursor-pointer hover:underline"
        >
          Log in
        </span>
      </p>
    </form>
  );
};

export default Signup;
