import React, { useState, useEffect } from 'react';
import axios, { HttpStatusCode } from 'axios';
import api from '../api';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllOrders = async (currentPage = 0) => {
    if (!token) return;

    try {
      const response = await api.get(`${backendUrl}api/v1/orders`);

      if (response.status === HttpStatusCode.Ok) {
        const content = response.data.content;

        if (Array.isArray(content) && content.length > 0) {

          
          setOrders(content);
        } else {
          setOrders([]);
        }

        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await api.patch(
        `${backendUrl}api/v1/orders/${orderId}?orderStatus=${event.target.value}`
      );
      if (response.status === HttpStatusCode.NoContent) {
        toast.success('Order status updated');
        fetchAllOrders(page);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllOrders(page);
  }, [token, page]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Page</h3>

      <div className="space-y-4">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 p-5 rounded"
          >
            <img src={assets.parcel_icon} alt="Parcel Icon" className="w-12" />

            <div>
              <div className="space-y-1">
                {order.orderItems.map((item, i) => (
                  <p key={i} className="text-sm">
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>
              <p className="mt-3 font-medium">{order.shippingAddress}</p>
              <p className="text-gray-500 text-sm">
                {new Date(order.createdDate).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm">Items: {order.orderItems.length}</p>
              <p className="text-sm">Method: {order.paymentMethod}</p>
              <p className="text-sm">Status: {order.status}</p>
            </div>

            <p className="text-sm font-semibold">
              {currency}
              {order.totalAmount}
            </p>

            <select
              onChange={(e) => statusHandler(e, order.orderId)}
              value={order.status}
              className="p-2 border rounded"
            >
              <option value="PENDING">Order Placed</option>
              <option value="READY_FOR_DELIVERY">Packing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for delivery</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-medium">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
