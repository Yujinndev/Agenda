import Navbar from '@/components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const Layout = () => {
  let location = useLocation()
  const isNotInOnboarding: Boolean =
    !location.pathname.startsWith('/onboarding')

  return (
    <main className="overflow-x-hidden max-w-screen">
      {isNotInOnboarding && <Navbar />}
      <div
        className={cn(
          'min-h-screen w-screen bg-grid-black/[0.002] overflow-y-auto',
          {
            'px-4 md:px-8 lg:px-16 xl:px-28 2xl:px-40 pt-20 flex justify-center items-start':
              isNotInOnboarding,
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
