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
import { useParams } from 'react-router-dom'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/components/Calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ScrollTop from '@/components/ui/ScrollToTop'
import Loading from '@/components/Loading'

const PublicEventDetail = () => {
  const { id } = useParams()
  const { data, isLoading } = useGetEventById(id as string)
  const event: Event = data
  const currentParticipantsCount = event?.participants?.length

  if (isLoading) {
    return <Loading />
  }

  const startDateTime = new Date(event.startDateTime)
  const endDateTime = new Date(event.endDateTime)

  return (
    <div className="w-full py-12 lg:px-28 xl:px-40">
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
          <div className="pb-2">
            <Badge
              variant="secondary"
              className="lg:text-base pt-1 bg-yellow-300 text-black"
            >
              {event.category}
            </Badge>
          </div>
          <h1 className="text-4xl dark:text-white md:text-5xl lg:text-6xl">
            {event.title}
          </h1>
          <div className="absolute right-0">
            <div className="lg:block hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-max rounded-full py-4 px-6 h-7"
                  >
                    Join Event <LogIn size={18} className="ms-1" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Are you sure you want to proceed?</SheetTitle>
                    <SheetDescription className="text-justify pt-10 text-base">
                      Please note that payments are to be made onsite during the
                      event. The organizer will handle all payments, and
                      attendees are advised to contact the organizer directly
                      for further details. We would like to clarify that this
                      system is exclusively for event creation and management,
                      and we regretfully cannot assume responsibility for
                      refunds or payment disputes. Your understanding and
                      cooperation are greatly appreciated, and we look forward
                      to welcoming you to the event.
                    </SheetDescription>
                    <SheetDescription className="text-justify pt-10 text-slate-400">
                      Disclaimer: By registering for and attending this event,
                      you acknowledge and agree to the following terms and
                      conditions. Participation in this event is at your own
                      risk, and the organizers, sponsors, and venue providers
                      are not responsible for any personal injury, loss, or
                      damage to property that may occur during the event.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetHeader className="w-full pt-10">
                    <Button onClick={() => console.log('click')}>
                      Confirm
                    </Button>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
            <div className="lg:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-max rounded-full py-4 px-6 h-7"
                  >
                    Join Event <LogIn size={18} className="ms-1" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Are you sure you want to proceed?</DrawerTitle>
                    <DrawerDescription className="text-justify pt-4">
                      Please note that payments are to be made onsite during the
                      event. The organizer will handle all payments, and
                      attendees are advised to contact the organizer directly
                      for further details. We would like to clarify that this
                      system is exclusively for event creation and management,
                      and we regretfully cannot assume responsibility for
                      refunds or payment disputes. Your understanding and
                      cooperation are greatly appreciated, and we look forward
                      to welcoming you to the event.
                    </DrawerDescription>
                    <DrawerDescription className="text-justify pt-4 text-slate-400">
                      Disclaimer: By registering for and attending this event,
                      you acknowledge and agree to the following terms and
                      conditions. Participation in this event is at your own
                      risk, and the organizers, sponsors, and venue providers
                      are not responsible for any personal injury, loss, or
                      damage to property that may occur during the event.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter className="pt-4">
                    <Button onClick={() => console.log('click')}>
                      Confirm
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
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
                {'Organized by: '}
                <h1>
                  {event.organizer?.firstName} {event.organizer?.lastName}
                </h1>
              </div>
            </div>
          </div>

          <h1 className="text-2xl">Schedule</h1>
          <div className="pb-4 flex gap-2">
            <CalendarClock size={20} />
            <span className="text-gray-600">
              {format(startDateTime, 'PPp')} - {format(endDateTime, 'PPp')}
            </span>
          </div>

          <h1 className="text-2xl mt-6">Venue</h1>
          <div className="pb-4 flex gap-2">
            <MapPinIcon size={20} />
            <span className="text-gray-600">{event.location}</span>
          </div>

          <h1 className="text-2xl mt-6">Overview</h1>
          <div className="pb-4 flex gap-2">
            <Clock size={20} />
            <span className="text-gray-600 capitalize">
              {formatDistance(startDateTime, endDateTime)}
            </span>
          </div>
          <p className="mt-2 lg:w-10/12">{event.details}</p>
          <p className="mt-2 lg:w-10/12">{event.purpose}</p>

          <h1 className="text-2xl mt-6">Participants</h1>
          <div className="pb-4 flex gap-2">
            <UserRoundCheck size={20} />
            <span className="text-gray-600">
              {currentParticipantsCount} / {event.estimatedAttendees} People
            </span>
          </div>

          <h1 className="text-2xl mt-6">Event Fee</h1>
          <div className="pb-4 flex gap-2">
            <Ticket size={20} />
            <span className="text-gray-600">
              {new Intl.NumberFormat('fil-ph', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 2,
              }).format(parseFloat(event.price))}
            </span>
          </div>
        </div>
      </div>
      <ScrollTop />
    </div>
  )
}

export default PublicEventDetail
