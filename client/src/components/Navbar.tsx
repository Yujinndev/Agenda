import { Link, useLocation } from 'react-router-dom'
import { CircleUser, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import useAuth from '@/hooks/useAuth'
import useLogout from '@/hooks/useLogout'
import { Button } from '@/components/ui/button'
import MobileMenu from '@/components/MobileMenu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LINKS = [
  {
    site: '/dashboard',
    name: 'Dashboard',
  },
  {
    site: '/events/my-events',
    name: 'My Events',
  },
  {
    site: '/events/browse?page=1',
    name: 'Browse Events',
  },
]

export const ProtectedLinks = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { pathname } = useLocation()

  return (
    <div className={cn('flex flex-col w-max md:flex-row gap-4', className)}>
      {LINKS.map((link) => (
        <Button
          key={link.site}
          size="sm"
          variant="ghost"
          className="relative ms-2 flex w-[96%] rounded-none justify-start p-2 md:w-auto md:justify-center md:px-5 border-b-[1px] lg:border-0"
          asChild
        >
          <Link to={link.site}>
            {link.name}
            {pathname.startsWith(link.site) && (
              <div className="absolute inset-y-8 h-1 w-10 rounded-xl bg-primary" />
            )}
          </Link>
        </Button>
      ))}
    </div>
  )
}

export const PublicLinks = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div>
      <Button variant="link" className={className} asChild>
        <Link to="/events/browse?page=1">Browse Events</Link>
      </Button>
    </div>
  )
}

const Navbar = () => {
  const location = useLocation()
  const { auth } = useAuth()
  const logout = useLogout()

  return (
    <div className="flex h-20 fixed z-50 items-center justify-between w-screen bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-28 2xl:px-40">
      <div className="w-[10%] md:hidden lg:block flex items-center gap-5">
        <MobileMenu />
        <Link to="/" className="text-xl text-black text-primary">
          <h1 className="font-black">Agenda</h1>
        </Link>
      </div>
      <div className="hidden w-[50%] md:flex">
        <div className="flex gap-6 text-sm text-gray-600">
          {auth?.accessToken ? <ProtectedLinks /> : <PublicLinks />}
        </div>
      </div>
      <div className="flex w-[30%] items-center justify-end gap-4 xl:gap-8">
        {auth?.accessToken ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full py-4" variant="outline">
                <div className="flex items-center gap-3 p-0">
                  <CircleUser className="flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="m-2 space-y-1 w-44">
              <DropdownMenuLabel>
                Hello, <span>@{auth?.user?.split('@')[0]}!</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Button
                className="relative grid grid-cols-9 gap-4 w-full"
                variant="destructive"
                onClick={logout}
              >
                <LogOut size={18} className="rotate-180" />
                <span className="col-span-8 mt-1">Logout</span>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          !location.pathname.startsWith('/response-form') && (
            <Button className="rounded-full py-4" asChild>
              <Link to="/onboarding/signin">
                <div className="flex items-center gap-3 px-4 py-8">
                  <CircleUser size={16} className="mb-[2px]" />
                  <span>Login</span>
                </div>
              </Link>
            </Button>
          )
        )}
      </div>
    </div>
  )
}

export default Navbar
