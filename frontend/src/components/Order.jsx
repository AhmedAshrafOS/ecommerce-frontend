// components/Order.jsx
import React, { useState, useContext } from 'react';
import { FaChevronDown, FaChevronUp, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import api from '../api';
import { toast } from 'react-toastify';

export default function Order({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const { backendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  // 1) click header → go to /orders/{orderNumber}
  const onHeaderClick = () => {
    navigate(`/orders/${order.orderId}`);
  };

  // 2) open rating modal (stop propagation so we don’t navigate)
  const onRateClick = (e,productId) => {
    e.stopPropagation();
    setProductId(productId)
    setShowModal(true);
  };

  // 3) submit rating + optional review
  const submitReview = async () => {
    if (ratingValue < 1) {
      return toast.error('Please select at least one star.');
    }
    try {
      // rateProduct endpoint
      await api.post(
        `${backendUrl}/products/${productId}/rate`,
        { ratingValue:ratingValue, orderId: order.orderId,comment: comment }
      );
      // only send review if there's text
      if (comment.trim()) {
        await api.post(
          `${backendUrl}/products/${productId}/review`,
          { orderId: order.orderId,comment: comment }
        );
      }
      toast.success('Thanks for your feedback!');
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review.');
    }
  };

  return (
    <>
          {order.status !== 'PENDING' && (
            <div
      className="border-b py-4 text-gray-800 "
      >
      {/* ─── Summary ─── */}
                 
      <div className="flex justify-between items-center ">
        <p onClick={onHeaderClick}  className="text-sm font-medium cursor-pointer">
          Order ID: <span className=" hover:text-red-600 text-gray-500">{order.orderNumber}</span>
        </p>
        <p className="text-sm font-medium">
          Total: {currency}{order.totalAmount.toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              order.status === 'DELIVERED'
                ? 'bg-green-500 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {order.status}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((e) => !e); }}
            className="text-gray-500 hover:text-black transition"
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

      </div>

      {/* ─── Items Details ─── */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {order.orderItems.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {currency}{item.unitPrice.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm">
                {currency}{(item.unitPrice * item.quantity).toFixed(2)}
              </p>
              {order.status === 'DELIVERED' && (
                <button
                  key={i}
                  onClick={e => onRateClick(e, item.productId)}
                  className="ml-4 px-3 py-1 bg-black text-white rounded hover:bg-red-600 transition"
                >
                  Write a product Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Rating Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold">Rate Your Order</h3>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className={`cursor-pointer transition ${
                    star <= ratingValue ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  size={24}
                />
              ))}
            </div>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave an optional comment..."
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
            <button
              onClick={submitReview}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
       )}
    </>


  );
}
