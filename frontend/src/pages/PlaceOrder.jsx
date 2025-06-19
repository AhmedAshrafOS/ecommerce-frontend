import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios, { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api'

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    governorate: '',
    buildingNumber: '',
    apartmentNumber: '',
    floor: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

const onSubmitHandler = async (event) => {
  event.preventDefault();

  try {
    if (method !== 'cod') {
           let orderItems = [];


    Object.keys(cartItems).forEach((itemId) => {
      if (cartItems[itemId].quantity > 0) {
        const itemInfo = structuredClone(products.find(product => product._id === itemId));
        if (itemInfo) {
          itemInfo.quantity = cartItems[itemId].quantity;
          orderItems.push(itemInfo);
        }
      }
    });

    const responseOne = await api.post(`${backendUrl}/orders`, {
      address: formData,
      paymentMethod: method,
      currency: 'usd',
      email: formData.email,
    });
    console.log(responseOne.data);
    
    if (responseOne.status ===HttpStatusCode.Created &&responseOne.data) {
      if ( responseOne.data.checkoutUrl) {
        window.location.href = responseOne.data.checkoutUrl; // redirect to gateway
      } else {
        toast.error(responseOne.data.message || 'Payment initialization failed');
      }
    }
      return; // stop here if payment method is not cod
    }

    // ========== COD FLOW ==========
 

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
      method
    };

    const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
      headers: { token }
    });

    if (response.data.success && response.data.orderId) {
      navigate(`/orders/${response.data.orderId}`);
    } else {
      toast.error(response.data.message);
    }

  } catch (error) {
    console.error(error);
    toast.error(error.message || 'Something went wrong');
  }
};

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='governorate' value={formData.governorate} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Governorate' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='buildingNumber' value={formData.buildingNumber} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Building Number' />
          <input required onChange={onChangeHandler} name='apartmentNumber' value={formData.apartmentNumber} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Apartment Number' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='floor' value={formData.floor} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='floor' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('STRIPE')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'STRIPE' ? 'bg-green-400' : ''}`}></p>
              <img className={`h-5 mx-4`} src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('PAYMOB')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'PAYMOB' ? 'bg-green-400' : ''}`} ></p>
              <img className={`h-5 mx-4`} src={assets.paymob_logo} alt="Paymob" />
            </div>
            <div onClick={() => setMethod('COD')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' 
                        className="relative group overflow-hidden bg-black text-white text-sm my-8 px-8 py-3"
          >
            <span className="absolute inset-0 bg-red-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10">PROCEED TO CHECKOUT</span>
          </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
