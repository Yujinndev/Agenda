import { Link, useParams } from 'react-router-dom'
import { ArrowUpLeft } from 'lucide-react'

import useAuth from '@/hooks/useAuth'
import { GROUP_VISIBILITY, JOIN_PERMISSION } from '@/constants/choices'
import Loading from '@/components/Loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/Tabs'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'
import GroupOverview from '@/components/group/GroupOverview'
import GroupMembers from '@/components/group/GroupMembers'
import GroupEvents from '@/components/group/GroupEvents'

const GroupDetails = () => {
  const { id } = useParams()
  const { auth } = useAuth()
  const { data, isLoading } = useGetGroupById(id as string)
  console.log('🚀 ~ GroupDetails ~ data:', data)

  const tabs = [
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
  ]

  if (isLoading) {
    return <Loading />
  }

  const creatorEmail = data?.members[0].user?.email
  const isAdmin = creatorEmail === auth.user

  const groupVisibility = GROUP_VISIBILITY.find(
    (el) => el.value === data.visibility
  )
  const joinPermission = JOIN_PERMISSION.find(
    (el) => el.value === data.joinPermission
  )

  const tabsToShow = isAdmin ? tabs.length : 2
  const visibleTabs = tabs.slice(0, tabsToShow)

  return (
    <div className="w-full pt-8">
      <div className="relative bg-green-900 px-8 mb-8 py-6 rounded-md text-white flex flex-col items-start justify-between md:flex-row md:items-center">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full absolute -top-2 -left-2 h-10 w-10 lg:hidden"
          asChild
        >
          <Link to="/events/my-groups" className="text-black">
            <ArrowUpLeft size={18} />
          </Link>
        </Button>

        <div className="flex flex-1 flex-col items-start gap-1 md:w-2/3 lg:w-1/2">
          <div className="space-x-1 mb-2">
            <Badge
              variant="secondary"
              className="pt-1 bg-yellow-300 text-black"
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
        {/* <div className="py-2">
          <div className="flex gap-2">
            {!isNextToApprove.isNext && (
              <Button
                size="sm"
                variant="outline"
                className="relative w-max rounded-full lg:px-6 lg:p-5 lg:flex hidden"
                asChild
              >
                <Link to="/events/my-events" className="text-black">
                  My Events <ArrowUpRight size={18} className="-mt-1 ms-2" />
                </Link>
              </Button>
            )}
            {isOrganizer && data.status !== 'FOR_APPROVAL' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Ellipsis className="flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2 space-y-1 w-40">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <UpdateFormDialog id={id as string} />
                  {data.status === 'ON_HOLD' && data.committees.length > 0 && (
                    <SendApprovalDialog
                      id={id as string}
                      committees={data.committees}
                    />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isNextToApprove.isNext ? (
            isNextToApprove?.status === 'WAITING' ? (
              <div className="flex items-center gap-3 justify-center pb-6 lg:pb-0">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() =>
                    handleEventCommitteeStep('REQUESTING_REVISION')
                  }
                >
                  <MessageCircleQuestion className="flex-shrink-0" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => handleEventCommitteeStep('APPROVED')}
                >
                  <Check className="flex-shrink-0" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="rounded-full"
                  onClick={() => handleEventCommitteeStep('REJECTED')}
                >
                  <X className="flex-shrink-0" />
                </Button>
              </div>
            ) : (
              <Badge
                variant="outline"
                className="text-white flex items-center gap-3 py-2 text-sm justify-center"
              >
                {approvalStatus?.label}
                {isUserAlreadyJoined && <li>Joined</li>}
              </Badge>
            )
          ) : null}
        </div> */}
      </div>

      <Tabs tabs={visibleTabs} activeTabClassName={'bg-green-700'} />
    </div>
  )
}

export default GroupDetails

// TODO: DISPLAY GROUP DETAILS ON MY GROUPS
