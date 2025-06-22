// src/pages/OrderPass.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // your axios instance with interceptors
import { ShopContext } from '../context/ShopContext';

const OrderPass = () => {
  const { orderId } = useParams();
  const { backendUrl,setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const markReadyAndClearCart = async () => {
      try {
        // 1) mark order READY_FOR_DELIVERY
        await api.put(
          `${backendUrl}/orders/${orderId}/confirm`
        );
        // 2) clear their cart
        // await api.delete(`${backendUrl}/cartItems/item/${orderId}`);
        setCartItems([])
        // 3) go to the success/details page
        navigate(`/orders/${orderId}`, { replace: true });
      } catch (err) {
        console.error('OrderPass error', err);
        // optionally show a toast here
      } finally {
        setLoading(false);
      }
    };
    markReadyAndClearCart();
  }, [orderId, backendUrl, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Processing your order…</p>
      </div>
    );
  }
  return null; // we immediately redirect, so nothing to show
};

export default OrderPass;
