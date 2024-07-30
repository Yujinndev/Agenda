import {
  CalendarClock,
  Clock,
  LogIn,
  MapPinIcon,
  Ticket,
  UserRoundCheck,
} from 'lucide-react'
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
import { format, formatDistance } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/components/Calendar'
import Loading from '@/components/Loading'
import useAuth from '@/hooks/useAuth'
import { QueryClient, useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '@/components/ui/use-toast'
import MarkdownFormat from '@/utils/MarkdownFormat'
import FloatingScrollButton from '@/components/ui/FloatingScrollButton'
import { FaUserSecret } from 'react-icons/fa6'

const PublicEventDetail = () => {
  const queryClient = new QueryClient()

  const { id } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const axios = useAxiosPrivate()

  const { data, isLoading, isSuccess } = useGetEventById(id as string)
  const event: Event = isSuccess && data
  const { mutate: handleJoinEvent } = useMutation({
    mutationFn: async () => {
      await axios.post('/api/event/join', {
        data: {
          email: auth.user,
          eventId: event.id,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-events'] })
      toast({
        description: 'You have confirmed your participation.',
        variant: 'success',
      })
      navigate('/dashboard')
    },
    onError: () => {
      toast({
        description: 'Failed to join the event.',
        variant: 'destructive',
      })
    },
  })

  const currentParticipantsCount = event?.participants?.length
  const isUserTheOrganizer = event.organizer?.email === auth.user
  const isUserAlreadyJoined = event?.participants?.find(
    (el: any) => el.email === auth.user
  )

  if (isLoading) {
    return <Loading />
  }

  const startDateTime = new Date(event.startDateTime)
  const endDateTime = new Date(event.endDateTime)

  return (
    <div className="w-full py-12 lg:px-28" id="details">
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
            <Badge
              variant="secondary"
              className="pt-1 bg-yellow-300 text-black"
            >
              {event.category}
            </Badge>
            <div className="lg:block hidden">
              {!isUserTheOrganizer ? (
                isUserAlreadyJoined ? (
                  <Badge
                    className="text-lg px-6 py-2 text-white"
                    variant="outline"
                  >
                    Joined
                  </Badge>
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
                        <SheetTitle>
                          Are you sure you want to proceed?
                        </SheetTitle>
                        <SheetDescription className="text-justify pt-10 text-base">
                          Please note that payments are to be made onsite during
                          the event. The organizer will handle all payments, and
                          attendees are advised to contact the organizer
                          directly for further details. We would like to clarify
                          that this system is exclusively for event creation and
                          management, and we regretfully cannot assume
                          responsibility for refunds or payment disputes. Your
                          understanding and cooperation are greatly appreciated,
                          and we look forward to welcoming you to the event.
                        </SheetDescription>
                        <SheetDescription className="text-justify pt-10 text-slate-400">
                          Disclaimer: By registering for and attending this
                          event, you acknowledge and agree to the following
                          terms and conditions. Participation in this event is
                          at your own risk, and the organizers, sponsors, and
                          venue providers are not responsible for any personal
                          injury, loss, or damage to property that may occur
                          during the event.
                        </SheetDescription>
                      </SheetHeader>
                      <SheetHeader className="w-full pt-10">
                        <Button onClick={() => handleJoinEvent()}>
                          Confirm
                        </Button>
                        <SheetClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </SheetClose>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                )
              ) : null}
            </div>
            <div className="lg:hidden">
              {!isUserTheOrganizer ? (
                isUserAlreadyJoined ? (
                  <Badge
                    className="text-lg px-6 py-2 text-white"
                    variant="outline"
                  >
                    Joined
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
                          Please note that payments are to be made onsite during
                          the event. The organizer will handle all payments, and
                          attendees are advised to contact the organizer
                          directly for further details. We would like to clarify
                          that this system is exclusively for event creation and
                          management, and we regretfully cannot assume
                          responsibility for refunds or payment disputes. Your
                          understanding and cooperation are greatly appreciated,
                          and we look forward to welcoming you to the event.
                        </DrawerDescription>
                        <DrawerDescription className="text-justify pt-4 text-slate-400">
                          Disclaimer: By registering for and attending this
                          event, you acknowledge and agree to the following
                          terms and conditions. Participation in this event is
                          at your own risk, and the organizers, sponsors, and
                          venue providers are not responsible for any personal
                          injury, loss, or damage to property that may occur
                          during the event.
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter className="pt-4">
                        <Button onClick={() => handleJoinEvent()}>
                          Confirm
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )
              ) : null}
            </div>
          </div>
          <h1 className="text-4xl dark:text-white lg:text-5xl">
            {event.title}
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
                <FaUserSecret size={40} className="flex-shrink-0" />
              </Button>
              <div className="text-gray-600 flex lg:items-center gap-x-2 flex-col lg:flex-row">
                {'Organized by: '}
                <div className="flex items-center gap-2">
                  <h1>
                    {event.organizer?.firstName} {event.organizer?.lastName}
                  </h1>
                  <p>{data?.organizer?.email === auth.user && '(You)'}</p>
                </div>
              </div>
            </div>
          </div>

          <DetailsCard
            title="Schedule"
            content={`${format(startDateTime, 'PPp')} - ${format(
              endDateTime,
              'PPp'
            )}`}
            icon={<CalendarClock size={30} className="flex-shrink-0" />}
          />

          <DetailsCard
            title="Venue"
            content={`${event.location}`}
            icon={<MapPinIcon size={30} className="flex-shrink-0" />}
          />

          <DetailsCard
            title="Overview"
            content={formatDistance(startDateTime, endDateTime)}
            icon={<Clock size={30} className="flex-shrink-0" />}
            additional={
              <div className="space-y-4">
                <MarkdownFormat details={event.details} />
                <MarkdownFormat details={event.purpose} />
              </div>
            }
          />

          <DetailsCard
            title="Participants"
            content={`${currentParticipantsCount} / ${event.estimatedAttendees} People`}
            icon={<UserRoundCheck size={30} className="flex-shrink-0" />}
          />

          <DetailsCard
            title="Joining Fee"
            content={new Intl.NumberFormat('fil-ph', {
              style: 'currency',
              currency: 'PHP',
              minimumFractionDigits: 2,
            }).format(parseFloat(event.price))}
            icon={<Ticket size={30} className="flex-shrink-0" />}
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
  content: string
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
