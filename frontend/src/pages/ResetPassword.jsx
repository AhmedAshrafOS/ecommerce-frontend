// src/pages/ResetPassword.jsx
import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [status, setStatus] = useState('pending') // pending | valid | invalid
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1️⃣ Validate the reset‐token on mount
  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }
    const validate = axios.get(
      `${backendUrl}/auth/reset-password-form?token=${token}`
    )
    toast.promise(validate, {
      pending: 'Validating reset link…',
      success: 'Link valid! Please choose a new password.',
      error: 'Invalid or expired link.'
    })
    validate.then(() => setStatus('valid')).catch(() => setStatus('invalid'))
  }, [backendUrl, token])

  // 2️⃣ Handle form input
  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // 3️⃣ Submit new password
  const handleSubmit = e => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setIsSubmitting(true)
    const reset = axios.post(`${backendUrl}/auth/reset-password`, {
      token,
      newPassword: form.newPassword
    })
    toast.promise(reset, {
      pending: 'Resetting password…',
      success: 'Password reset! Redirecting to login…',
      error: 'Reset failed. Try again.'
    })
    reset
      .then(() => {
        setTimeout(() => navigate('/login'), 5000)
      })
      .finally(() => setIsSubmitting(false))
  }

  // 4️⃣ Pick what to render
  let body
  if (status === 'pending') {
    body = <p className="text-gray-700">Validating link, please wait…</p>
  } else if (status === 'invalid') {
    body = (
      <>
        <p className="text-red-600">❌ Invalid or expired reset link.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </>
    )
  } else {
    body = (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={form.newPassword}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-black text-white py-2 rounded transition ${
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-600'
          }`}
        >
          {isSubmitting ? 'Submitting…' : 'Reset Password'}
        </button>
      </form>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md border rounded-lg px-8 py-6 text-center max-w-md w-full">
        <h1 className="text-xl font-semibold mb-4">Reset Password</h1>
        {body}
      </div>
    </div>
  )
}

export default ResetPassword
