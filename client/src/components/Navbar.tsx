import React from 'react'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import { CircleUser, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobileMenu from '@/components/MobileMenu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import useAuth from '@/hooks/useAuth'
import useLogout from '@/hooks/useLogout'

const LINKS = [
  {
    site: '/dashboard',
    name: 'Dashboard',
  },
  {
    site: '/events/my-events',
    name: 'Your Events',
  },
  {
    site: '/events/browse',
    name: 'Browse Events',
  },
  {
    name: 'Groups',
    site: '/groups',
    children: [
      {
        site: '/groups/my-groups',
        name: 'Your Groups',
      },
      {
        site: '/groups/browse',
        name: 'Browse Groups',
      },
    ],
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
          <div>
            {link.name === 'Groups' ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent p-0">
                      Groups
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 px-4 py-3">
                        {link.children?.map((el) => (
                          <Link
                            key={el.site}
                            to={el.site}
                            className="rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {el.name}
                          </Link>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link to={link.site}>{link.name}</Link>
            )}

            {pathname.startsWith(link.site) && (
              <div className="absolute inset-y-8 h-1 w-10 rounded-xl bg-primary" />
            )}
          </div>
        </Button>
      ))}
    </div>
  )
}

export const PublicLinks = () => {
  return (
    <div>
      <Button variant="link" asChild>
        <Link to="/events/browse?page=1">Browse Events</Link>
      </Button>
      <Button variant="link" asChild>
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
      <div className="w-[10%] lg:w-auto md:hidden lg:block flex items-center gap-5">
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
