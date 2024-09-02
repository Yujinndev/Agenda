import { ArrowUpLeft, LogIn, Notebook, Shield } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/Loading'
import useAuth from '@/hooks/useAuth'
import { QueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '@/components/ui/use-toast'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'
import { JOIN_PERMISSION } from '@/constants/choices'
import FloatingScrollButton from '@/components/ui/FloatingScrollButton'
import { MdAdminPanelSettings } from 'react-icons/md'

const PublicEventDetail = () => {
  const queryClient = new QueryClient()
  const axios = useAxiosPrivate()

  const { id } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, isSuccess } = useGetGroupById(id as string)

  if (isLoading) {
    return <Loading />
  }

  const group = isSuccess && data

  const getJoinPermission = JOIN_PERMISSION.find(
    (el) => el.value === group?.joinPermission
  )

  const handleOnJoinGroup = async () => {
    try {
      await axios.post('/api/group/join', {
        data: {
          email: auth.user,
          groupId: group?.id,
        },
      })

      toast({
        description: 'You have joined the group.',
        variant: 'success',
      })
      navigate(`/groups/detail/${id}`)
      return queryClient.invalidateQueries({ queryKey: ['my-groups'] })
    } catch {
      toast({
        description: 'Failed to join the group.',
        variant: 'destructive',
      })
    }
  }

  const creator = `${group?.members[0].user?.firstName} ${group?.members[0].user?.lastName}`
  const creatorEmail = group?.members[0].user?.email
  const isUserAlreadyJoined = group.members?.some(
    ({ email }: { email: string }) => email === auth?.user
  )

  return (
    <div className="w-full py-12 lg:px-28" id="#details">
      <div className="relative w-full lg:h-[500px] h-52 rounded-t-2xl overflow-hidden">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full absolute top-0 left-0 h-10 w-10 text-black z-50"
          onClick={() => navigate(-1)}
        >
          <ArrowUpLeft size={20} className="flex-shrink-0" />
        </Button>

        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover blur-xl"
          style={{
            backgroundImage:
              "url('https://st2.depositphotos.com/3591429/6312/i/450/depositphotos_63124153-Word-Group-on-a-Brick-wall.jpg')",
          }}
        />
        <img
          className="relative w-[80%] h-full object-cover mx-auto"
          src="https://st2.depositphotos.com/3591429/6312/i/450/depositphotos_63124153-Word-Group-on-a-Brick-wall.jpg"
          alt="eventImage"
        />
      </div>

      <div className="bg-green-900 px-8 mb-4 rounded-b-md text-white flex flex-col-reverse justify-between md:flex-row md:items-center">
        <div className="relative flex flex-1 flex-col items-start gap-1 py-4 pt-8 md:w-2/3 lg:w-1/2">
          <div className="pb-2 flex justify-between w-full">
            <div className="pb-2 flex justify-start w-full">
              <Badge
                variant="secondary"
                className="pt-1 bg-yellow-300 text-black"
              >
                {getJoinPermission?.label}
              </Badge>
            </div>

            <div className="lg:block hidden">
              {isUserAlreadyJoined ? (
                <Navigate to={`/groups/detail/${id}`} state={'redirected'} />
              ) : (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-max rounded-md py-5 px-6 h-7 space-x-3"
                    >
                      <p>Join Event</p> <LogIn size={18} className="m-1" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Are you sure you want to proceed?</SheetTitle>
                      <SheetDescription className="text-justify pt-10 text-base">
                        Please exercise caution when joining this group. It is
                        important to thoroughly review the group's rules and
                        guidelines before participating. Failure to adhere to
                        these rules may result in removal from the group. We
                        encourage respectful and constructive interaction among
                        members to maintain a positive environment. This group
                        is designed to facilitate shared interests, support, and
                        collaboration among its members. By joining, you agree
                        to actively contribute to the group's purpose and uphold
                        its standards.
                      </SheetDescription>
                      <SheetDescription className="text-justify pt-10 text-slate-700">
                        Disclaimer: By joining and participating in this group,
                        you acknowledge and accept full responsibility for your
                        actions and interactions within the group. The
                        organizers and platform providers are not liable for any
                        personal disputes, disagreements, or issues that may
                        arise between members. Participation is at your own
                        risk, and you are solely responsible for ensuring your
                        own safety and well-being. The group organizers reserve
                        the right to enforce rules and take necessary actions to
                        maintain the integrity of the group.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetHeader className="w-full pt-10">
                      <Button onClick={() => handleOnJoinGroup()}>
                        Confirm
                      </Button>
                      <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </SheetClose>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            <div className="lg:hidden">
              {isUserAlreadyJoined ? (
                <Navigate to={`/groups/detail/${id}`} state={'redirected'} />
              ) : (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-max rounded-md py-5 px-6 h-7 space-x-2"
                    >
                      <p className="mt-[2px]">Join Event</p>{' '}
                      <LogIn size={18} className="m-1" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>
                        Are you sure you want to proceed?
                      </DrawerTitle>
                      <DrawerDescription className="text-justify pt-4">
                        Please exercise caution when joining this group. It is
                        important to thoroughly review the group's rules and
                        guidelines before participating. Failure to adhere to
                        these rules may result in removal from the group. We
                        encourage respectful and constructive interaction among
                        members to maintain a positive environment. This group
                        is designed to facilitate shared interests, support, and
                        collaboration among its members. By joining, you agree
                        to actively contribute to the group's purpose and uphold
                        its standards.
                      </DrawerDescription>
                      <DrawerDescription className="text-justify pt-4 text-slate-700">
                        Disclaimer: By joining and participating in this group,
                        you acknowledge and accept full responsibility for your
                        actions and interactions within the group. The
                        organizers and platform providers are not liable for any
                        personal disputes, disagreements, or issues that may
                        arise between members. Participation is at your own
                        risk, and you are solely responsible for ensuring your
                        own safety and well-being. The group organizers reserve
                        the right to enforce rules and take necessary actions to
                        maintain the integrity of the group.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="pt-4">
                      <Button onClick={() => handleOnJoinGroup()}>
                        Confirm
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </div>
          <h1 className="text-4xl dark:text-white lg:text-5xl">
            {group?.name}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-6">
        <div className="text-justify col-span-4 p-2">
          <div className="px-8 py-4 bg-slate-100 rounded-lg mb-4">
            <div className="flex gap-4 pt-1 items-center">
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="p-8 rounded-full pointer-events-none"
              >
                <MdAdminPanelSettings size={40} className="flex-shrink-0" />
              </Button>
              <div className="text-gray-600 flex lg:items-center gap-x-2 flex-col lg:flex-row">
                {'Admin: '}
                <h1>
                  {creator} {creatorEmail === auth.user && '(You)'}
                </h1>
              </div>
            </div>
          </div>

          <DetailsCard
            title="Description"
            content={`${group?.description}`}
            icon={<Notebook size={30} className="flex-shrink-0" />}
          />
          <DetailsCard
            title="Rules"
            icon={<Shield size={30} className="flex-shrink-0" />}
            content={
              group.rules.length > 0
                ? group.rules.map((rule: string) => (
                    <div key={rule}>
                      <li>{rule}</li>
                    </div>
                  ))
                : 'No rules have been set for this group.'
            }
          />
        </div>
      </div>
      <FloatingScrollButton to="#details" />
    </div>
  )
}

export const DetailsCard = ({
  title,
  content,
  icon,
  additional,
}: {
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  additional?: React.ReactNode
}) => {
  return (
    <div className="py-4 text-lg">
      <h1 className="text-2xl">{title}</h1>
      <div className="py-4 flex items-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="p-6 pointer-events-none"
        >
          {icon}
        </Button>
        <span className="capitalize pt-[2px]">{content}</span>
      </div>
      {additional}
    </div>
  )
}

export default PublicEventDetail
