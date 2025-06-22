// Refactored Admin Management UI
import React, { useState, useEffect } from 'react';
import api from '../api'
import axios, { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('create');
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get(`${backendUrl}api/v1/users/admins`)
  
      if (response.status === HttpStatusCode.Ok) {
        
        
          setAdmins(response.data);
      }
      else if (response.status === HttpStatusCode.Forbidden) {  
        toast.error('Access denied. You do not have permission to view this page.');
      }
   
    } catch (error) {
      const err = Object.values(error.response?.data)[0];

      toast.error(err|| error.message);
    }
  };

  const createAdmin = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}api/v1/users`,
        { email, username, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === HttpStatusCode.Ok) {
        toast.success('Admin created successfully');
        resetForm();
        fetchAdmins();
      }
      else if (response.status === HttpStatusCode.Forbidden) {  
        toast.error('Access denied. You do not have permission to view this page.');
      }

    } catch (error) {
      const err = Object.values(error.response?.data)[0];

      toast.error(err|| error.message);
    }
  };

  const updateAdmin = async () => {
    if (!oldPassword) {
      toast.error('Old password is required to update');
      return;
    }
    try {
      if (newPassword !== confirmPassword) {
          toast.error('Password and confirm password do not match');
          return;
        }

      const response = await axios.patch(
        `${backendUrl}api/v1/users/${selectedAdmin.userId}`,
        { email, username, oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === HttpStatusCode.NoContent) {
          toast.success('Admin updated successfully');
          resetForm();
          setConfirmPassword('');
          fetchAdmins();
      }
      else if (response.status === HttpStatusCode.Forbidden) {  
        toast.error('Access denied. You do not have permission to view this page.');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update admin');
    }
  };

  const deleteAdmin = async (id) => {
    try {
     const response =  await axios.delete(`${backendUrl}api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === HttpStatusCode.NoContent) {
        toast.success('Admin deleted');
        fetchAdmins();
      }
      else if (response.status === HttpStatusCode.Forbidden) {  
        toast.error('Access denied. You do not have permission to view this page.');
      }
    } catch (error) {
      toast.error('Failed to delete admin');
    }
  };

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setOldPassword('');
    setNewPassword('');
    setSelectedAdmin(null);
    setShowForm(false);
    setFormType('create');
  };

  const openUpdateForm = (admin) => {
    setSelectedAdmin(admin);
    setEmail(admin.email);
    setUsername(admin.username);
    setShowForm(true);
    setFormType('update');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Management</h2>
        <button
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
          onClick={() => setShowForm(true)}
        >
          <FaPlus />
        </button>
      </div>

      {admins.map((admin) => (
        <div
          key={admin.userId}
          className="border p-4 mb-2 rounded flex justify-between items-center"
        >
          <div>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Username:</strong> {admin.username}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="text-blue-600"
              onClick={() => openUpdateForm(admin)}
            >
              <FaEdit />
            </button>
            <button
              className="text-red-600"
              onClick={() => deleteAdmin(admin.userId)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">
            {formType === 'create' ? 'Create New Admin' : 'Update Admin'}
          </h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-3"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 mb-3"
          />

          {formType === 'create' ? (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 mb-3"
            />
          ) : (
            <>
              <input
                type="password"
                placeholder="Old Password (required)"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border p-2 mb-3"
              />
              <input
                type="password"
                placeholder="New Password (optional)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 mb-3"
              />
             {formType !== 'create'  &&(<input
                type="password"
                placeholder="Confirm Password "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-2 mb-3"
                />) 
    }
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={formType === 'create' ? createAdmin : updateAdmin}
              className="bg-black text-white px-6 py-2"
            >
              {formType === 'create' ? 'Create Admin' : 'Update Admin'}
            </button>
            <button onClick={resetForm} className="text-gray-600 underline">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
