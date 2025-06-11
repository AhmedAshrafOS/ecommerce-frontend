import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Wishlist = () => {
  const { products, currency, wishlistItems, addToCart, removeFromWishlist } = useContext(ShopContext);
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const temp = [];
      for (const id in wishlistItems) {
        if (wishlistItems[id] > 0) {
          temp.push({
            _id: id,
            quantity: wishlistItems[id]
          });
        }
      }
      setWishlistData(temp);
    }
  }, [wishlistItems, products]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'WISHLIST'} />
      </div>
      <div>
        {wishlistData.map((item, index) => {
          const product = products.find(p => p._id === item._id);
          if (!product) return null;

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img src={product.images[0]} className='w-16 sm:w-20' alt={product.name} />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{product.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{product.price}</p>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2 justify-end'>
                <button
                  onClick={() => {
                    addToCart(item._id);
                    removeFromWishlist(item._id);
                  }}
                  className='text-xs text-green-600 underline'
                >
                  Add to Cart
                </button>
                <img
                  onClick={() => removeFromWishlist(item._id)}
                  src={assets.bin_icon}
                  className='w-4 sm:w-5 cursor-pointer'
                  alt="Remove"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
