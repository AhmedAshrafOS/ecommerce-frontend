import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Replace with your actual "request reset email" endpoint
    const sendLink = axios.post(`${backendUrl}/auth/request-password-reset?email=${email}`);

    toast.promise(sendLink, {
      pending: 'Sending reset link…',
      success: 'Reset link sent! Check your inbox.',
      error: 'Failed to send link. Please try again.'
    })

    try {
      await sendLink
      setEmail('')
    } catch (_) {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-md border rounded-lg px-8 py-6 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
        <p className="text-gray-700 mb-6">
          Enter your email below and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
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
            {isSubmitting ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword
