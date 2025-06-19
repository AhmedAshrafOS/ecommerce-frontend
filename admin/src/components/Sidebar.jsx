import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = ({ userRole }) => {
  const isSuperAdmin = userRole === 'ROLE_SUPER_ADMIN';

  return (
    <>
      {/* Desktop / Tablet */}
      <aside className="hidden md:flex flex-col w-1/5 border-r max-h-full  bg-white">
        <nav className="flex flex-col gap-2 p-4">
          {isSuperAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
            >
              <img src={assets.add_icon} alt="" className="w-5 h-5" />
              <span className="text-sm">Add Admins</span>
            </NavLink>
          )}
          <NavLink
            to="/add"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <img src={assets.add_icon} alt="" className="w-5 h-5" />
            <span className="text-sm">Add Items</span>
          </NavLink>
          <NavLink
            to="/list"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <img src={assets.order_icon} alt="" className="w-5 h-5" />
            <span className="text-sm">List Items</span>
          </NavLink>
          <NavLink
            to="/order"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <img src={assets.order_icon} alt="" className="w-5 h-5" />
            <span className="text-sm">Order Items</span>
          </NavLink>
          <div className='h-screen'></div>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t flex justify-around py-2">
        {isSuperAdmin && (
          <NavLink to="/admin" className="flex flex-col items-center text-xs">
            <img src={assets.add_icon} alt="" className="w-6 h-6" />
            <span>Add Adm</span>
          </NavLink>
        )}
        <NavLink to="/add" className="flex flex-col items-center text-xs">
          <img src={assets.add_icon} alt="" className="w-6 h-6" />
          <span>Add Items</span>
        </NavLink>
        <NavLink to="/list" className="flex flex-col items-center text-xs">
          <img src={assets.order_icon} alt="" className="w-6 h-6" />
          <span>List</span>
        </NavLink>
        <NavLink to="/order" className="flex flex-col items-center text-xs">
          <img src={assets.order_icon} alt="" className="w-6 h-6" />
          <span>Orders</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
