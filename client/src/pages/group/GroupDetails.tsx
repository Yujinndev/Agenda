import { useState } from 'react'
import { ArrowUpLeft, LogOut } from 'lucide-react'
import { QueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/Loading'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GROUP_VISIBILITY, JOIN_PERMISSION } from '@/constants/choices'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'
import GroupOverview from '@/components/group/GroupOverview'
import GroupMembers from '@/components/group/GroupMembers'
import GroupEvents from '@/components/group/GroupEvents'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '@/components/ui/use-toast'

const GroupDetails = () => {
  const { id } = useParams()
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useAuth()
  const { data, isLoading } = useGetGroupById(id as string)

  const [tabs] = useState([
    {
      title: 'Overview',
      value: 'overview',
      content: <GroupOverview id={id as string} />,
    },
    {
      title: 'Group Events',
      value: 'groupevents',
      content: <GroupEvents id={id as string} />,
    },
    {
      title: 'Members',
      value: 'members',
      content: <GroupMembers id={id as string} />,
    },
  ])

  if (isLoading) {
    return <Loading />
  }

  const handleOnLeaveGroup = async () => {
    try {
      await axios.post('/api/group/leave', {
        data: {
          email: auth?.user,
          groupId: id,
        },
      })

      toast({
        description: 'You have left the group.',
        variant: 'success',
      })
      navigate('/groups/browse')

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-groups'] }),
        queryClient.invalidateQueries({ queryKey: ['public-group'] }),
      ])
    } catch {
      toast({
        description: 'Failed to leave the group.',
        variant: 'destructive',
      })
    }
  }

  const groupVisibility = GROUP_VISIBILITY.find(
    (el) => el.value === data.visibility
  )
  const joinPermission = JOIN_PERMISSION.find(
    (el) => el.value === data.joinPermission
  )

  const isCreator = data.members[0].user?.email === auth?.user
  const showTabsOnPermission = isCreator ? tabs.length : 2
  const visibleTabs = tabs.slice(0, showTabsOnPermission)

  return (
    <div className="w-full pt-8">
      <div className="relative bg-green-900 px-8 mb-8 py-6 rounded-md text-white flex flex-col items-start justify-between md:flex-row md:items-center">
        {!location.state && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full absolute -top-2 -left-2 h-10 w-10 text-black"
            onClick={() => navigate(-1)}
          >
            <ArrowUpLeft size={20} className="flex-shrink-0" />
          </Button>
        )}

        <div className="flex flex-col lg:flex-row w-full justify-between lg:items-center gap-2">
          <div className="flex flex-1 flex-col items-start gap-1 md:w-2/3 lg:w-1/2">
            <div className="space-x-1 mb-2">
              <Badge
                variant="secondary"
                className="pt-1 bg-yellow-300 text-black uppercase"
              >
                {joinPermission?.label}
              </Badge>

              <Badge variant="secondary" className="pt-1 uppercase">
                {groupVisibility?.label}
              </Badge>
            </div>
            <h1 className="text-4xl dark:text-white md:text-4xl lg:text-5xl">
              {data.name}
            </h1>
          </div>

          {!isCreator && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-max rounded-md py-5 px-6 h-7 space-x-3 cursor-pointer"
                >
                  <LogOut size={18} className="rotate-180" />
                  <p className="text-white">Leave Group</p>{' '}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to leave this group?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Leaving the group will remove
                    you from all group activities and communications. You will
                    no longer have access to group content, and any
                    contributions you made may remain in the group at the
                    discretion of the group administrators.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleOnLeaveGroup()}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <Tabs tabs={visibleTabs} activeTabClassName={'bg-green-700'} />
    </div>
  )
}

export default GroupDetails
