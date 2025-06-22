import React, { useContext, useState,useEffect } from 'react';
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
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products,customerProfile } = useContext(ShopContext);
  const [method, setMethod] = useState('STRIPE');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    governorate: '',
    buildingNumber: '',
    apartmentNumber: '',
    floor: '',
    country: ''
  });

  

  const loadAddressToForm = (address) => {
    setFormData(prev => ({
      ...prev,
      street: address.street,
      city: address.city,
      governorate: address.governorate,
      buildingNumber: address.buildingNumber,
      apartmentNumber: address.apartmentNumber,
      floor: address.floor,
      country: address.country
    }));
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId === '') {
      setUseNewAddress(true);
      setFormData(prev => ({
        ...prev,
        street: '',
        city: '',
        governorate: '',
        buildingNumber: '',
        apartmentNumber: '',
        floor: '',
        country: ''
      }));
    } else {
      setUseNewAddress(false);
      const selected = savedAddresses.find(addr => addr.addressId.toString() === addressId);
      if (selected) {
        loadAddressToForm(selected);
      }
    }
  };

  
  useEffect(() => {
      try {
        setFormData(prev => ({
          ...prev,
          firstName: customerProfile.firstName,
          lastName: customerProfile.lastName,
          email: customerProfile.email,
          phone: customerProfile.phoneNumber
        }));
        setSavedAddresses(customerProfile.addresses || []);

        const primary = customerProfile.addresses?.find(addr => addr.primary);
        if (primary) {
          setSelectedAddressId(primary.addressId.toString());
          loadAddressToForm(primary);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user profile");
      }
  }, []);



  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };



  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (method !== 'COD') {

      const registerPromise =  api.post(`${backendUrl}/orders`, {
        address: formData,
        paymentMethod: method,
        currency: 'usd',
        email: formData.email,
        });
          toast.promise(
            registerPromise,
            {
              pending: 'Procceding to checkout...',
              success: 'Redirecting..',
            }
          );
          setIsSubmitting(true)

        const response = await registerPromise
        if (response.status ===HttpStatusCode.Created &&response.data) {
          if ( response.data.checkoutUrl) {
            window.location.href = response.data.checkoutUrl; // redirect to gateway
          } else {
            toast.error(response.data.message || 'Payment initialization failed');
          }
        }
       setIsSubmitting(false)
        return; // stop here if payment method is not cod
      }

    // ========== COD FLOW ==========
  

      const responseTwo = await api.post(`${backendUrl}/orders`, {
        address: formData,
        paymentMethod: method,
        currency: 'usd',
        email: formData.email,
      });


      if (responseTwo.status ===HttpStatusCode.Created &&responseTwo.data) {
 
        navigate("/orders/success/"+`${responseTwo.data.checkoutUrl}`);
      } else {
        toast.error(responseTwo.data.message);
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
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="tel" placeholder='Phone' />

        <div className='mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Select Delivery Address</label>
          <select
            value={selectedAddressId}
            onChange={(e) => handleAddressSelection(e.target.value)}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full mb-3'
          >
            <option value="">Enter new address</option>
            {savedAddresses.map((address) => (
              <option key={address.addressId} value={address.addressId}>
                {address.street}, Building {address.buildingNumber}, {address.city}
                {address.primary ? ' (Primary)' : ''}
              </option>
            ))}
          </select>
        </div>

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
          <input required onChange={onChangeHandler} name='floor' value={formData.floor} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Floor' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
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
              <img className='h-5 mx-4' src={assets.stripe_logo || "/placeholder.svg"} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('COD')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm my-8 px-8 py-3 bg-black text-white hover:bg-red-600 transition disabled:bg-gray-500"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
