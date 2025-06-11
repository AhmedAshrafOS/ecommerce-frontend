import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import Order from '../components/Order'; // reusable component

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const res = await axios.post(`${backendUrl}/api/order/userOrders`, {}, { headers: { token } });
      if (res.data.success) {
        const { orders } = res.data;
        const current = [], delivered = [];

        orders.forEach((order) => {
         
          
          const totalPrice = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const orderObj = {
            ...order,
            totalPrice,
          };

          if (order.status === 'Delivered') {
            delivered.push(orderObj);
          } else {
            current.push(orderObj);
          }
        });

        setCurrentOrders(current.reverse());
        setDeliveredOrders(delivered.reverse());
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
   

      {/* Current Orders */}
      <section className="mt-10">
      <div className='text-2xl mb-3'>
             <Title text1="MY" text2="ORDERS" />
      </div>
    
        {currentOrders.length === 0 ? (
          <p className="text-gray-500">No current orders found.</p>
        ) : (
          currentOrders.map((order, idx) => (
            <Order key={idx} order={order} showRating={false} />
          ))
        )}
      </section>

      {/* Delivered Orders */}
      <section className="mt-10">
        <div className='text-2xl mb-3'>
            <Title text1="MY" text2="Delivered Orders" />
        </div>
     
        {deliveredOrders.length === 0 ? (
          <p className="text-gray-500">No delivered orders yet.</p>
        ) : (
          deliveredOrders.map((order, idx) => (
            <Order key={idx} order={order} showRating={true} />
          ))
        )}
      </section>
    </div>
  );
};

export default Orders;
