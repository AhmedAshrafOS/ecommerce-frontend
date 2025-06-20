import React, { useState, useContext } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';

const Order = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const { currency } = useContext(ShopContext);
  console.log(order);
  
  return (
    <div className="border-b py-4 text-gray-800">
      {/* Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          Order ID: <span className="text-gray-500">{order.orderNumber}</span>
        </p>
        <p className="text-sm font-medium">
          Total: {currency}{order.totalAmount.toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              order.status === 'Delivered'
                ? 'bg-green-500 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {order.status}
          </span>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-gray-500 hover:text-black transition"
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {order.orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {currency}{item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
