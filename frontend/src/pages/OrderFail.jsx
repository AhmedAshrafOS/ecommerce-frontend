// src/pages/OrderFail.jsx
import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ShopContext } from '../context/ShopContext';

const OrderFail = () => {
  const { orderId } = useParams();
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const removeAndRedirect = async () => {
      try {
        // delete the failed order
        await api.delete(`${backendUrl}/orders/${orderId}`);
      } catch (err) {
        console.error('OrderFail delete error', err);
      }
      // wait 4s so the user sees the UI, then send them back to cart
      setTimeout(() => navigate('/cart', { replace: true }), 4000);
    };
    removeAndRedirect();
  }, [orderId, backendUrl, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <div className="text-red-600 text-8xl mb-4">✖</div>
        <h1 className="text-2xl font-semibold mb-2">Payment Failed</h1>
        <p className="text-gray-700 mb-4">
          Your order <span className="font-medium">#{orderId}</span> could not be processed.
        </p>
        <p className="text-gray-500">Redirecting back to your cart…</p>
      </div>
    </div>
  );
};

export default OrderFail;
