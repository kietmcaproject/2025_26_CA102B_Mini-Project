import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useUser } from '../stores/user'

export function AppLayout() {
  const user = useUser((s) => s.user)
  const logout = useUser((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className='min-h-full flex flex-col'>
      <header className='sticky top-0 z-50 bg-rosevale/90 backdrop-blur border-b border-mango'>
        <div className='container-px mx-auto flex items-center justify-between py-3'>
          <NavLink to='/home' className='text-2xl font-display text-white'>
            Café Delight
          </NavLink>

          <nav className='flex items-center gap-4 text-white'>
            <NavLink to='/home'>Home</NavLink>
            <NavLink to='/menu'>Menu</NavLink>
            <NavLink to='/cart'>Cart</NavLink>
            <NavLink to='/checkout'>Checkout</NavLink>
            <NavLink to='/status'>Order Status</NavLink>

            {user && (
              <div className='relative group'>
                {/* Avatar Icon */}
                <div className='w-10 h-10 rounded-full bg-white text-rosevale font-bold flex items-center justify-center cursor-pointer shadow-md'>
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown Menu */}
                <div className='absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50'>
                  {/* Header */}
                  <div className='px-4 py-3 border-b bg-coffee-50 rounded-t-xl'>
                    <p className='font-semibold text-coffee-900'>{user.name}</p>
                    <p className='text-xs text-gray-500 truncate'>
                      {user.email}
                    </p>
                  </div>

                  {/* Links */}
                  <NavLink
                    to='/profile'
                    className='block px-4 py-2 text-sm hover:bg-mango/20 text-coffee-800 transition-colors'
                  >
                    👤 My Profile
                  </NavLink>

                  <NavLink
                    to='/orders'
                    className='block px-4 py-2 text-sm hover:bg-mango/20 text-coffee-800 transition-colors'
                  >
                    📜 My Orders
                  </NavLink>

                  <button
                    onClick={() => {
                      logout()
                      window.location.href = '/login'
                    }}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl'
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  )
}
