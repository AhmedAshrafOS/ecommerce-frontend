import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Offers</h1>
          
          {/* SHOP NOW Button */}
          <div className='mt-4'>
            <button
              onClick={() => navigate('/shop')}
              className='text-sm md:text-base font-semibold border border-[#414141] px-5 py-2 hover:bg-[#414141] hover:text-white transition'
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <img className='w-full sm:w-1/2' src={assets.banner} alt="Hero" />
    </div>
  );
};

export default Hero;
