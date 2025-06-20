import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import Order from '../components/Order';
import api from '../api';

const Orders = () => {
  const { backendUrl } = useContext(ShopContext);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        // No need to pass token header — Spring will pick up the authenticated user from the session/principal
        const res = await api.get(`${backendUrl}/orders/customer`);
        if (res.status === 200) {
          const orders = res.data; // List<OrderResponseDTO>
          const current = [];
          const delivered = [];

          orders.forEach(order => {

            console.log(order);
            
            // compute totalPrice from orderItems
            const totalPrice = order.totalAmount
            const enriched = { ...order, totalPrice };

            if (order.status === 'DELIVERED') {
              delivered.push(enriched);
            } else {
              current.push(enriched);
            }
          });

          setCurrentOrders(current.reverse());
          setDeliveredOrders(delivered.reverse());
        }
      } catch (err) {
        console.error('Error loading orders:', err);
      }
    };

    loadOrderData();
  }, [backendUrl]);

  return (
    <div className="border-t pt-16">
      {/* Pending / In-progress orders */}
      <section className="mt-10">
        <div className="text-2xl mb-3">
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

      {/* Delivered orders */}
      <section className="mt-10">
        <div className="text-2xl mb-3">
          <Title text1="MY" text2="DELIVERED ORDERS" />
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
