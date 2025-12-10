import { motion } from 'framer-motion'
import { useUser } from '../stores/user'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function ProfilePage() {
  const user = useUser((s) => s.user)
  const logout = useUser((s) => s.logout)
  const navigate = useNavigate()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordMessage('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      const res = await fetch(
        'http://localhost:5000/api/auth/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      setPasswordMessage('✅ Password updated successfully')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordError(err.message || 'Something went wrong')
    }
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className='min-h-screen bg-coffee-50 flex justify-center items-start py-12'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'
      >
        {/* Profile Circle */}
        <div className='flex justify-center'>
          <div className='h-28 w-28 rounded-full bg-rosevale text-white flex items-center justify-center text-3xl font-bold shadow-lg'>
            {initials}
          </div>
        </div>

        {/* User Info */}
        <h2 className='mt-4 text-center text-2xl font-semibold text-coffee-900'>
          {user.name}
        </h2>
        <p className='text-center text-coffee-600'>{user.email}</p>

        {/* Info Cards */}
        <div className='mt-6 space-y-4'>
          <div className='bg-coffee-50 p-3 rounded-md'>
            <p className='text-xs text-coffee-500'>Name</p>
            <p className='text-sm font-medium'>{user.name}</p>
          </div>

          <div className='bg-coffee-50 p-3 rounded-md'>
            <p className='text-xs text-coffee-500'>Email</p>
            <p className='text-sm font-medium'>{user.email}</p>
          </div>

          {/* CHANGE PASSWORD */}
          <div className='bg-white border rounded-xl p-4 space-y-3'>
            <h3 className='font-semibold text-coffee-900'>Change Password</h3>

            <input
              type='password'
              placeholder='Current Password'
              className='input-field'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type='password'
              placeholder='New Password'
              className='input-field'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type='password'
              placeholder='Confirm New Password'
              className='input-field'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className='btn-primary w-full'
              onClick={handleChangePassword}
            >
              Update Password
            </button>

            {passwordMessage && (
              <p className='text-green-600'>{passwordMessage}</p>
            )}
            {passwordError && <p className='text-red-500'>{passwordError}</p>}
          </div>

          <div className='bg-coffee-50 p-3 rounded-md opacity-60'>
            <p className='text-xs text-coffee-500'>Phone (coming soon)</p>
            <p className='text-sm font-medium'>Not added</p>
          </div>
        </div>

        {/* Buttons */}
        <div className='mt-6 space-y-3'>
          <button
            className='w-full bg-peacock text-white py-2 rounded-xl'
            onClick={() => alert('Edit profile coming soon')}
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className='w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600'
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  )
}
