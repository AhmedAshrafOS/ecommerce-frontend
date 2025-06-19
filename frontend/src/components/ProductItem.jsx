import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({
  id,
  imageUrl,
  name,
  price,
  discountPercentage = 0
}) => {
  const { currency } = useContext(ShopContext);

  const hasDiscount     = discountPercentage > 0;
  const originalPrice   = price.toFixed(2);
  const discountedPrice = (price * (1 - discountPercentage / 100)).toFixed(2);

  return (
    <Link to={id ? `/product/${id}` : '#'} className="block">
      <div className="relative border border-transparent hover:border-gray-300 hover:shadow-md rounded-md p-4 transition-all duration-200 min-w-fit">
        {/* Product Image */}
        <img
          src={imageUrl}
          alt={name || 'Product'}
          className="w-full h-48 object-cover rounded"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Product Name */}
        <p className="mt-3 text-sm font-medium text-gray-800">
          {name || 'No Name'}
        </p>

        {/* Pricing */}
        <div className="mt-1 flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-red-500 line-through text-sm">
              {currency}{originalPrice}
            </span>
          )}
          <span className="text-lg font-semibold text-gray-900">
            {currency}{hasDiscount ? discountedPrice : originalPrice}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
