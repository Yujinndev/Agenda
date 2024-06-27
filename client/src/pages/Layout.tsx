import React from 'react'
import Navbar from '@/components/Navbar'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const Layout = ({ children }: { children: React.ReactNode }) => {
  let location = useLocation()
  const isNotInLogin: Boolean = location.pathname !== '/signin'

  return (
    <main>
      <Navbar />
      <div
        className={cn(
          'flex items-center pt-20 justify-center min-h-screen bg-grid-black/[0.025] overflow-y-auto',
          {
            'lg:px-16 xl:px-32 2xl:px-64': isNotInLogin,
          }
        )}
      >
        {children}
        <Toaster />
      </div>
    </main>
  )
}

export default Layout
