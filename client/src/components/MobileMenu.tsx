import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ProtectedLinks, PublicLinks } from './Navbar'
import useAuth from '@/hooks/useAuth'

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-0 inset-y-16 flex min-h-screen w-full flex-col items-start gap-4 bg-slate-100 p-1 py-4 md:hidden"
        >
          {auth?.accessToken ? (
            <ProtectedLinks className="text-xl font-semibold w-screen" />
          ) : (
            <PublicLinks />
          )}
        </motion.div>
      )}
    </div>
  )
}

export default MobileMenu
