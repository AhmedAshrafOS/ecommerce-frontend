import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { backendUrl, token } = useContext(ShopContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {

    const res = await axios.post(`${backendUrl}/api/order/getorderbyidd`, { orderId }, { headers: { token } });
        

        if (res.data.success) {
           
            console.log();
            
          setOrder(res.data.data);
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      }
    };

    fetchOrder();
  }, [backendUrl, orderId, token]);

  if (!order) {
    return <p className="text-center mt-10">Loading your order...</p>;
  }

  return (
    <div className=" pt-14 px-4 sm:px-10 max-w-4xl mx-auto border-t">
        <div className="text-2xl">
            <Title text1="ORDER" text2="CONFIRMED 🎉" />
            <p className="text-sm text-gray-600 mb-6">
                Order ID: <span className="font-medium">{orderId}</span>
            </p>
        </div>


      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Delivery Info</h2>
        <div className="text-sm text-gray-700">
          <p><strong>Name:</strong> {order.address.firstName} {order.address.lastName}</p>
          <p><strong>Email:</strong> {order.address.email}</p>
          <p><strong>Phone:</strong> {order.address.phone}</p>
          <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}, {order.address.country}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Ordered Products</h2>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm">{item.price * item.quantity} USD</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right font-semibold text-lg mb-2">
        Total Paid: {order.amount} USD
      </div>

      <div className="text-right text-sm text-gray-600">
        Payment Method: {order.paymentMethod.toUpperCase()} | Status: {order.status}
      </div>
    </div>
  );
};

export default OrderSuccess;
