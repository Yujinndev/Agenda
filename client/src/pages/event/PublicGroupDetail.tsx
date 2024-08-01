import { LogIn, LogOut, Notebook } from 'lucide-react'
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
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ScrollTop from '@/components/ui/ScrollToTop'
import Loading from '@/components/Loading'
import useAuth from '@/hooks/useAuth'
import { QueryClient, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '@/components/ui/use-toast'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'
import { UserGroup } from '@/types/group'
import { JOIN_PERMISSION } from '@/constants/choices'
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

const PublicEventDetail = () => {
  const queryClient = new QueryClient()

  const { id } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const axios = useAxiosPrivate()

  const { data, isLoading, isSuccess } = useGetGroupById(id as string)
  const group: UserGroup | undefined = isSuccess ? data && data : undefined

  const getJoinPermission = JOIN_PERMISSION.find(
    (el) => el.value === group?.joinPermission
  )

  // const checkJoinPermission = () => ({if(getJoinPermission === 'ANYONE_CAN_JOIN')})

  const { mutate: handleJoinGroup } = useMutation({
    mutationFn: async () => {
      await axios.post('/api/event/join-group', {
        data: {
          email: auth.user,
          groupId: group?.id,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-groups'] })
      toast({
        description: 'You have joined the group.',
        variant: 'success',
      })
      navigate('/events/group')
    },
    onError: () => {
      toast({
        description: 'Failed to join the group.',
        variant: 'destructive',
      })
    },
  })
  const { mutate: handleLeaveGroup } = useMutation({
    mutationFn: async () => {
      await axios.post('/api/event/leave-group', {
        data: {
          email: auth.user,
          groupId: group?.id,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-groups'] })
      toast({
        description: 'You have left the group.',
        variant: 'success',
      })
      navigate('/events/group')
    },
    onError: () => {
      toast({
        description: 'Failed to leave the group.',
        variant: 'destructive',
      })
    },
  })

  const creator = `${group?.members[0].user?.firstName} ${group?.members[0].user?.lastName}`
  const creatorEmail = group?.members[0].user?.email

  const isUserTheCreator = creatorEmail === auth.user
  const isUserAlreadyJoined = group?.members?.find(
    (el: any) => el.email === auth.user
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="w-full py-12 lg:px-28">
      <div className="relative w-full lg:h-[500px] h-52 rounded-t-2xl overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover blur-xl"
          style={{
            backgroundImage:
              "url('https://sb.ecobnb.net/app/uploads/sites/3/2021/09/event-plan.jpg')",
          }}
        />
        <img
          className="relative w-[80%] h-full object-cover mx-auto"
          src="https://sb.ecobnb.net/app/uploads/sites/3/2021/09/event-plan.jpg"
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
              {isUserTheCreator ? (
                <Badge
                  className="text-lg px-6 py-2 text-white"
                  variant="outline"
                >
                  Admin
                </Badge>
              ) : isUserAlreadyJoined ? (
                <div className="relative">
                  <Badge
                    className="text-lg px-6 py-2 text-white"
                    variant="outline"
                  >
                    Member
                  </Badge>
                  <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="warning"
                          className="w-max rounded-full py-4 px-4 h-7 space-x-3 cursor-pointer"
                        >
                          <p className="text-white">Leave Group</p>{' '}
                          <LogOut size={18} color="white" className="m-1 " />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to leave this group?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Leaving the group will
                            remove you from all group activities and
                            communications. You will no longer have access to
                            group content, and any contributions you made may
                            remain in the group at the discretion of the group
                            administrators.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleLeaveGroup()}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-max rounded-full py-4 px-6 h-7 space-x-3"
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
                      <Button onClick={() => handleJoinGroup()}>Confirm</Button>
                      <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </SheetClose>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              )}
            </div>
            <div className="lg:hidden">
              {isUserTheCreator ? (
                <Badge
                  className="text-lg px-6 py-2 text-white"
                  variant="outline"
                >
                  Admin
                </Badge>
              ) : isUserAlreadyJoined ? (
                <Badge
                  className="text-lg px-6 py-2 text-white"
                  variant="outline"
                >
                  Member
                </Badge>
              ) : (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-max rounded-full py-4 px-6 h-7 space-x-2"
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
                      <Button onClick={() => handleJoinGroup()}>Confirm</Button>
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
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-gray-600 flex lg:items-center gap-x-2 flex-col lg:flex-row">
                {'Admin: '}
                <h1>
                  {' '}
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
            content={
              group?.rules && group.rules.length > 0
                ? group.rules.map((rule: any, index: number) => (
                    <div key={rule.id}>
                      <p>{`${index + 1}. ${rule.description}`}</p>
                    </div>
                  ))
                : 'No rules have been set for this group.'
            }
          />
        </div>
      </div>
      <ScrollTop />
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
