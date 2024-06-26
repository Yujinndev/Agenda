import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

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
        <div className="absolute left-0 top-20 z-10 flex h-[calc(100vh-96px)] bg-slate-100 min-h-screen w-full flex-col items-center justify-center gap-8 text-xl font-medium">
          {MENULISTS.map((menu) => (
            <Link key={menu.href} to={menu.href} onClick={() => flipMenu()}>
              {menu.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default MobileMenu
