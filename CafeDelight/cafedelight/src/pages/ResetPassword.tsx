import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiPost } from '../api/api'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Invalid or expired reset link')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await apiPost(`/api/auth/reset-password/${token}`, {
        password,
      })

      setMessage(res.message || 'Password reset successfully')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-coffee-50'>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white p-8 rounded-2xl shadow-xl w-full max-w-md'
      >
        <h1 className='text-3xl font-bold text-coffee-900 mb-6'>
          Reset Password
        </h1>

        <input
          type='password'
          placeholder='New Password'
          className='input-field mb-4'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type='password'
          placeholder='Confirm Password'
          className='input-field mb-4'
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type='submit'
          className='w-full bg-rosevale text-white py-3 rounded-xl mt-2'
        >
          {loading ? 'Updating…' : 'Reset Password'}
        </button>

        {error && (
          <p className='mt-3 text-center text-red-500 text-sm'>{error}</p>
        )}

        {message && (
          <p className='mt-3 text-center text-emerald-600 text-sm'>{message}</p>
        )}

        <p className='text-sm text-center mt-4'>
          <Link to='/login' className='text-rosevale font-semibold'>
            Back to Login
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
