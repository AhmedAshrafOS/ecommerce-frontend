import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { backendUrl} = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const confirmPromise = axios.post(
      `${backendUrl}/auth/confirm-account?token=${token}`
    );

    toast.promise(
      confirmPromise,
      {
        pending: 'Confirming your email…',
        success: 'Email confirmed! Redirecting to login…',
        error: 'Confirmation failed. Please try again.'
      }
    );

    confirmPromise
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate('/login'), 2500);
      })
      .catch(() => setStatus('error'));
  }, [token, navigate]);

  let message;
  if (status === 'pending') {
    message = 'Confirming your email, please wait…';
  } else if (status === 'success') {
    message = '✅ Your email has been confirmed! Redirecting…';
  } else {
    message = '❌ Email confirmation failed. The link may be invalid or expired.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md border rounded-lg px-8 py-6 text-center max-w-md w-full">
        <h1 className="text-xl font-semibold mb-4">Email Verification</h1>
        <p className="text-gray-700">{message}</p>
        {status === 'error' && (
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
