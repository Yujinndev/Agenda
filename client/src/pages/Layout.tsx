import Navbar from '@/components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const Layout = () => {
  let location = useLocation()
  const isNotInLogin: Boolean = location.pathname !== '/signin'

  return (
    <main>
      {isNotInLogin && <Navbar />}
      <div
        className={cn(
          'flex items-center justify-center min-h-screen bg-grid-black/[0.015] overflow-y-auto',
          {
            'lg:px-16 xl:px-32 2xl:px-64 pt-20': isNotInLogin,
          }
        )}
      >
        <Outlet />
        <Toaster />
      </div>
    </main>
  )
}

export default Layout
