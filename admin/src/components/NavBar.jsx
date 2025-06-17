import React from 'react'
import {assets} from '../assets/assets'
import { toast } from 'react-toastify'
import { backendUrl } from '../App';
import axios, { HttpStatusCode } from 'axios'
const NavBar = ({ setToken }) => {
   const logOutFetch = async () => {
    setToken('') ;
    try {
      const response = await axios.post(`${backendUrl}api/v1/auth/logout`,        {},              // no body
        { 
          withCredentials: true  // ensures cookies are included
        }
    );
  
      if (response.status === HttpStatusCode.Ok) {
   
        toast.success('Logged out successfully')
      }
      else if (response.status === HttpStatusCode.Forbidden) {  
        toast.error('Access denied. You do not have permission to view this page.');
      }
   
    } catch (error) {
    }
  };


  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button onClick={()=>{logOutFetch()}}

          className="
            bg-black text-white
            px-5 py-2 sm:px-7 sm:py-2
            rounded-full text-xs sm:text-sm
            hover:bg-red-600 hover:text-black
            transition-colors duration-200 ease-in-out
          "
        >
          Logout
        </button>
    </div>
  )
}

export default NavBar
