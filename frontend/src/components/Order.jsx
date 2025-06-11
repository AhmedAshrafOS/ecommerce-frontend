import React, { useState, useContext } from 'react';
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Order = ({ order, showRating }) => {
  const [expanded, setExpanded] = useState(false);
  const [ratings, setRatings] = useState(() =>
    order.items.reduce((acc, item) => {
      acc[item._id] = item.rating || 0;
      return acc;
    }, {})
  );

  const { token, backendUrl, currency } = useContext(ShopContext);

  const handleRate = async (itemId, rating) => {
    setRatings((prev) => ({ ...prev, [itemId]: rating }));

    try {
      await axios.post(
        `${backendUrl}/api/order/rate`,
        { itemId, rating },
        { headers: { token } }
      );
    } catch (err) {
      console.error('Failed to rate:', err);
    }
  };

  return (
    <div className="border-b py-4 text-gray-800">
      {/* Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Order ID: <span className="text-gray-500">{order._id}</span></p>
        <p className="text-sm font-medium">Total: {currency}{order.totalPrice}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-red-600 text-white'}`}>
            {order.status}
          </span>
          <button onClick={() => setExpanded(!expanded)} className="text-gray-500 hover:text-black transition">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div className="flex items-center gap-4">
                <img src={item.images[0]} alt={item.name} className="w-14 h-14 object-cover rounded-md" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {currency}{item.price} × {item.quantity}
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              {showRating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer transition ${
                        star <= (ratings[item._id] || 0) ? 'text-red-600' : 'text-gray-300'
                      }`}
                      onClick={() => handleRate(item._id, star)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
