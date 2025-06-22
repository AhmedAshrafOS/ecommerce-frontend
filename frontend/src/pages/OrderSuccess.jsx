import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios, { HttpStatusCode } from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import api from '../api'

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { backendUrl, token } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [orderMessage, setOrderMessage] = useState("Loading your order...")
  useEffect(() => {
    const fetchOrder = async () => {
      try {

    const res = await api.get(`${backendUrl}/orders/${orderId}`);

        if (res.status === HttpStatusCode.Ok) {
          setOrder(res.data);
        } else {
          console.error(res.data.message);
        }
      } catch (err) {

        setOrderMessage("Order Not Found")
        console.error('Failed to fetch order', err);
      }
    };

    fetchOrder();
  }, [backendUrl, orderId, token]);

  if (!order) {
    return <p className="text-center mt-10">{orderMessage}</p>;
  }

  return (
    <div className=" pt-14 px-4 sm:px-10 max-w-4xl mx-auto border-t">
        <div className="text-2xl">
            <Title text1="ORDER" text2="CONFIRMED 🎉" />
            <p className="text-sm text-gray-600 mb-6">
                Order ID: <span className="font-medium">{order.orderNumber}</span>
            </p>
        </div>


      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Delivery Info</h2>
        <div className="text-sm text-gray-700">
          <p><strong>Name:</strong> {order.firstName} {order.lastName}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.shippingAddress}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Ordered Products</h2>
        <div className="space-y-3">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm">{item.unitPrice * item.quantity} USD</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right font-semibold text-lg mb-2">
        Total Paid: {order.totalAmount} USD
      </div>

      <div className="text-right text-sm text-gray-600">
        Payment Method: {order.paymentMethod} | Status: {order.status}
      </div>
    </div>
  );
};

export default OrderSuccess;
