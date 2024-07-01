import { Link } from 'react-router-dom'
import { CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobileMenu from '@/components/MobileMenu'
import useAuth from '@/hooks/useAuth'
import useLogout from '@/hooks/useLogout'

export const ProtectedLinks = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div>
      <Button variant="link" className={className} asChild>
        <Link to="/dashboard">Dashboard</Link>
      </Button>
      <Button variant="link" className={className} asChild>
        <Link to="/events">Events</Link>
      </Button>
      <Button variant="link" className={className} asChild>
        <Link to="/events/new">New</Link>
      </Button>
    </div>
  )
}

export const PublicLinks = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div>
      <Button variant="link" className={className} asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  )
}

const Navbar = () => {
  const { auth } = useAuth()
  const logout = useLogout()

  return (
    <div className="flex h-20 fixed z-50 items-center justify-between w-full bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="w-[20%] md:hidden lg:block flex items-center gap-5">
        <MobileMenu />
        <Link to="/" className="text-lg font-bold text-primary">
          <h1>Agenda</h1>
        </Link>
      </div>
      <div className="hidden w-[50%] md:flex">
        <div className="flex gap-6 text-sm text-gray-600">
          {auth?.accessToken ? <ProtectedLinks /> : <PublicLinks />}
        </div>
      </div>
      <div className="flex w-[30%] items-center justify-end gap-4 xl:gap-8">
        {auth?.accessToken ? (
          <Button variant="destructive" onClick={logout}>
            <div className="flex items-center gap-3 px-4 py-8">
              <CircleUser size={14} />
              <span>Logout</span>
            </div>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/signin">
              <div className="flex items-center gap-3 px-4 py-8">
                <CircleUser size={14} />
                <span>Login</span>
              </div>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default Navbar
