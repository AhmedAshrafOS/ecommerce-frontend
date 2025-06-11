import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Wishlist from './Wishlist';

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    removeItemCart,
    addToWishlist
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const itemId in cartItems) {
        if (cartItems[itemId].quantity > 0) {
          tempData.push({
            _id: itemId,
            quantity: cartItems[itemId].quantity
          });
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          if (!productData) return null;

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img src={productData.images[0]} className='w-16 sm:w-20' alt={productData.name} />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, Number(e.target.value))
                }
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type="number"
                min='1'
                defaultValue={item.quantity}
              />

              <div className='flex items-center gap-2 justify-end'>
                <img
                  onClick={() => removeItemCart(item._id)}
                  src={assets.bin_icon}
                  className='w-4 sm:w-5 cursor-pointer'
                  alt="Delete"
                />
                <div>|</div>
                <img
                  onClick={() => {
                    removeItemCart(item._id);
                    addToWishlist(item._id, item.quantity);
                  }}
                  src={assets.wishlist_icon}
                  className='w-4 sm:w-5 cursor-pointer'
                  alt="Add to Wishlist"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className="relative group overflow-hidden bg-black text-white text-sm my-8 px-8 py-3"
            >
              <span className="absolute inset-0 bg-red-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></span>
              <span className="relative z-10">PROCEED TO CHECKOUT</span>
            </button>
          </div>
        </div>
      </div>

      <Wishlist />
    </div>
  );
};

export default Cart;
