import { Link, useLocation } from 'react-router-dom'
import { CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobileMenu from '@/components/MobileMenu'
import useAuth from '@/hooks/useAuth'
import useLogout from '@/hooks/useLogout'
import { cn } from '@/lib/utils'

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
    site: '/events/browse',
    name: 'Browse Events',
  },
  {
    site: '/groups/browse',
    name: 'Browse Groups',
  },
  {
    site: '/groups/my-groups',
    name: 'My Groups',
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
        <Link to="/events/browse">Browse Events</Link>
      </Button>
      <Button variant="link" className={className} asChild>
        <Link to="/groups/browse">Browse Groups</Link>
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
          <Button onClick={logout} className="rounded-full py-4">
            <div className="flex items-center gap-3 px-4 py-8">
              <CircleUser size={14} />
              <span>@{auth?.user?.split('@')[0]}</span>
            </div>
          </Button>
        ) : (
          !location.pathname.startsWith('/response-form') && (
            <Button className="rounded-full py-4" asChild>
              <Link to="/onboarding/signin">
                <div className="flex items-center gap-3 px-4 py-8">
                  <CircleUser size={14} />
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
