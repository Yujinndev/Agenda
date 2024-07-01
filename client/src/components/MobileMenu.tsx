import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ProtectedLinks, PublicLinks } from './Navbar'
import useAuth from '@/hooks/useAuth'

interface MenuList {
  href: string
  title: string
}

const MENULISTS: MenuList[] = [
  {
    href: '/',
    title: 'Dashboard',
  },
  {
    href: '/events',
    title: 'Events',
  },
]

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false)
  const { auth } = useAuth()

  const flipMenu = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="md:hidden">
      <div
        className="flex cursor-pointer flex-col gap-[5.25px]"
        onClick={() => flipMenu()}
      >
        <div
          className={cn(
            'bg-primary h-[3px] w-5 origin-left rounded-full duration-500 ease-in-out',
            {
              'rotate-45 w-6': isOpen,
            }
          )}
        />
        <div
          className={cn(
            'bg-primary h-[3px] w-6 rounded-sm duration-500 ease-in-out',
            {
              'opacity-0': isOpen,
            }
          )}
        />
        <div
          className={cn(
            'bg-primary h-[3px] w-3 origin-left rounded-sm duration-500 ease-in-out',
            {
              '-rotate-45 w-6': isOpen,
            }
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-20 -z-10 flex h-[calc(100vh-96px)] bg-slate-100 min-h-screen w-full flex-col  gap-2 text-left divide-red-50 pt-4">
          {auth?.accessToken ? (
            <ProtectedLinks className="text-xl font-semibold w-screen border-b-[1px] h-max rounded-none" />
          ) : (
            <PublicLinks />
          )}
        </div>
      )}
    </div>
  )
}

export default MobileMenu
