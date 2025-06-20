import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api'

const Wishlist = () => {
  const { backendUrl, token, currency, getUserCart,wishlistData,setWishlistData,getWishlist } = useContext(ShopContext);
  const navigate = useNavigate();


  // 1) Load wishlist on mount (or when token changes)
  useEffect(() => {
    if (!token) {
      setWishlistData([]);
      return;
    }
    else{
      getWishlist().catch(err => {
        console.error(err);
        toast.error('Failed to load wishlist');
      });
    }
  }, [backendUrl, token]);

  // 2) Remove from wishlist
  const handleRemove = async (productId) => {
    if (!token) {
      toast.info('Please log in to remove items from your wishlist.');
    }
    try {
      await api.delete(
        `${backendUrl}/wishlist/product/${productId}`);
      setWishlistData(wishlistData.filter(item => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error(err);
      toast.error('Could not remove item.');
    }
  };

  // 3) Move from wishlist to cart
  const handleMoveToCart = async (productId) => {
    if (!token) {
      toast.info('Please log in to move items to your cart.');
    }
    try {
      await api.post(
        `${backendUrl}/wishlist/product/toCart/${productId}?quantity=1`);
      toast.success('Moved to cart');
      // refresh cart count
      if (getUserCart) getUserCart(token);
      // remove locally
      setWishlistData(wishlistData.filter(item => item.productId !== productId));
    } catch (err) {
      console.error(err);
      toast.error('Could not move item.');
    }
  };

  // If user not logged in, just show a prompt
  if (!token) {
    return (
      <div className='border-t pt-14 text-center text-gray-600'>
        <Title text1='YOUR' text2='WISHLIST' />
        <p className='mt-6'>You must <button onClick={()=>navigate('/login')} className='underline'>log in</button> to see your wishlist.</p>
      </div>
    );
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'WISHLIST'} />
      </div>
      <div>
        {wishlistData.length === 0 && (
          <p className='text-gray-600'>Your wishlist is empty.</p>
        )}
        {wishlistData.map((item, index) => (
          <div
            key={index}
            className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
          >
            <div className='flex items-start gap-6'>
              <img
                src={item.imageUrl}
                className='w-16 sm:w-20'
                alt={item.productName}
              />
              <div>
                <p className='text-xs sm:text-lg font-medium'>{item.productName}</p>
                {/* <div className='flex items-center gap-5 mt-2'>
                  <p>{currency}{item.unitPrice.toFixed(2)}</p>
                </div> */}
              </div>
            </div>
            <div className='flex items-center gap-2 justify-end'>
              <button
                onClick={() => handleMoveToCart(item.productId)}
                className='text-xs text-green-600 underline'
              >
                Add to Cart
              </button>
              <img
                onClick={() => handleRemove(item.productId)}
                src={assets.bin_icon}
                className='w-4 sm:w-5 cursor-pointer'
                alt="Remove"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
