import React, { useState } from 'react'
import axios from 'axios';
import api from '../api'
import { backendUrl } from '../App'
import { toast ,Slide} from 'react-toastify';
import { getUserRoleFromToken } from '../utils/jwtHelper';
const Login = ({setToken,setUserRole}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const onSubmitHandler = async (e) =>{
        try{
            e.preventDefault();
            const response = await api.post(backendUrl + 'api/v1/auth/login', {
                usernameOrEmail: email,
                password: password
            
            })
            if(response.status === 200){
                toast.success("Login Successful");
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setUserRole(getUserRoleFromToken(response.data.token));
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch (error){
          console.log(error);
          
            toast.error(error.response.data.message)
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Email Address or UserName</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="username" placeholder='your@email.com' required/>
            </div>
            <div className='mb-3 min-w-72'>
                <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' required />
            </div>
        <button
        type="submit"
            className="relative group overflow-hidden bg-black mt-2 w-full py-2 px-4 rounded-md text-white"
          >
            <span className="absolute inset-0 bg-red-600 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10">Login</span>
          </button>
    
        </form>
      </div>
    </div>
  )
}

export default Login
