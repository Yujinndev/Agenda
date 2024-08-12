import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Filter, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GroupList from '@/components/group/GroupList'
import { useGetUserGroups } from '@/hooks/api/useGetUserGroups'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/Loading'

const MyGroups = () => {
  const [selectedFilter, setSelectedFilter] = useState('public')
  const { data: groups, isSuccess, isLoading } = useGetUserGroups()

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4 lg:pt-10">
      <div className="flex flex-col lg:flex-row items-start lg:justify-between lg:items-center gap-4 bg-green-900 lg:px-8 p-4 lg:pb-4 rounded-md">
        <div className="md:w-2/3 py-2 lg:w-1/2 text-white">
          <h1 className="text-3xl">Your groups</h1>
          <p>Check out your groups regularly——don't miss the fun!</p>
        </div>

        <div className="flex justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="relative rounded-full w-11 h-11 p-2"
                variant="outline"
              >
                <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex justify-center">
                  {groups.length}
                </Badge>
                <Filter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedFilter}
                onValueChange={setSelectedFilter}
              >
                {['public', 'private'].map((filter) => {
                  const countOfEventByFilter = groups.filter(
                    (el: any) => el.visibility.toLowerCase() === filter
                  )

                  return (
                    <DropdownMenuRadioItem
                      key={filter}
                      value={filter}
                      className="capitalize"
                    >
                      {filter}
                      {countOfEventByFilter.length > 0 && (
                        <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex justify-center">
                          {countOfEventByFilter.length}
                        </Badge>
                      )}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="rounded-full w-11 h-11 p-2"
            variant="outline"
            asChild
          >
            <Link to="/groups/new">
              <Plus color="black" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 py-8 px-3 lg:px-6">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-bold dark:text-gray-300 md:text-xl capitalize">
            {selectedFilter} Groups
          </p>
        </div>

        {isSuccess && (
          <GroupList
            groups={groups.filter(
              (group: any) => group.visibility.toLowerCase() == selectedFilter
            )}
          />
        )}
      </div>
    </section>
  )
}

export default MyGroups
