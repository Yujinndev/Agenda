import { Link } from 'react-router-dom'
import { motion, MotionProps } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ArrowLeft, ArrowRight, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type Event = {
  id: string
  title: string
  purpose: string
  details: string
  category: string
  price: string
  status: string
  location?: string
  estimatedAttendees?: number
  startDateTime: Date
  endDateTime: Date
  eventFeedbacks?: any
  organizer?: any
  participants?: any
  committees?: any
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar = ({ events }: { events: Event[] }) => {
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate)

  useEffect(() => {
    setCurrentMonth(currentDate)
  }, [])

  const firstDayOfMonth = startOfMonth(currentMonth)
  const lastDayOfMonth = endOfMonth(currentMonth)

  // get all the days in the currentMonth
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1))
  }

  // get the events on each date
  const eventsByDate = useMemo(() => {
    return (
      events.length > 0 &&
      events.reduce((acc: any, event: Event) => {
        const eventStartDate = event.startDateTime ?? '2000-01-01 00:00:00'
        const dateKey = format(eventStartDate, 'yyyy-MM-dd')
        return {
          ...acc,
          [dateKey]: [...(acc[dateKey] || []), event],
        }
      }, {})
    )
  }, [events])

  // Get event count for the current month
  const eventCountForCurrentMonth = useMemo(() => {
    return events.filter(
      (event: Event) =>
        event.status !== 'CANCELLED' &&
        isWithinInterval(new Date(event.startDateTime), {
          start: firstDayOfMonth,
          end: lastDayOfMonth,
        })
    ).length
  }, [events, firstDayOfMonth, lastDayOfMonth])

  const startingDayIndex = getDay(firstDayOfMonth)

  return (
    <div className="lg:col-span-4 relative">
      <div className="bg-green-900 text-white lg:px-8 px-4 py-2 -m-1 rounded-md">
        <div className="flex justify-between items-end lg:items-center gap-4 pb-4 lg:w-full flex-row py-4 border-b-[1px] border-white mb-2">
          <div className="relative w-max flex flex-col lg:flex-row items-start justify-start lg:items-center gap-x-4 gap-1">
            <MonthPagination
              prev={() => prevMonth()}
              next={() => nextMonth()}
            />

            <div className="relative w-max">
              <h1 className="text-3xl  font-black dark:text-white">
                {format(currentMonth, 'MMMM yyyy')}
              </h1>
              <Button
                className="absolute -right-8 -top-2 rounded-full w-6 h-6 p-0 bg-slate-300 text-black hover pointer-events-none"
                variant="secondary"
              >
                <span className="text-sm font-mono">
                  {eventCountForCurrentMonth}
                </span>
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="rounded-full w-11 h-11 p-2"
              variant="outline"
              asChild
            >
              <Link to="/events/new">
                <Plus color="black" />
              </Link>
            </Button>
            <Button className="rounded-full w-11 h-11 p-2" variant="outline">
              <Link to="/groups/my-groups">
                <Users color="black" />
              </Link>
            </Button>
          </div>
        </div>
        <HeaderBlock items={WEEKDAYS} />
      </div>

      <div className="relative">
        <AllDays
          startingDayIndex={startingDayIndex}
          daysInMonth={daysInMonth}
          eventsByDate={eventsByDate}
        />
      </div>
    </div>
  )
}

const AllDays = ({
  startingDayIndex,
  daysInMonth,
  eventsByDate,
}: {
  startingDayIndex: number
  daysInMonth: Date[]
  eventsByDate: []
}) => {
  return (
    <div className="relative grid gap-1 grid-cols-7 lg:gap-1 pt-4 bg-white/30 rounded-md">
      {Array.from({ length: startingDayIndex }).map((_, index) => {
        return (
          <DateBlock
            key={`empty-${index}`}
            className="border-0 text-center lg:block"
          />
        )
      })}

      {daysInMonth.map((day, index) => {
        const dateKey: any = format(day, 'yyyy-MM-dd')
        const todaysEvents: Event[] = eventsByDate[dateKey] || []

        return (
          <DateBlock
            key={index}
            className={cn(
              'relative gap-2 rounded-md bg-slate-100 text-base overflow-hidden',
              {
                'bg-slate-500 text-white': isToday(day),
              }
            )}
          >
            <div
              className={cn('absolute bottom-1 right-1 lg:hidden z-10', {
                hidden: todaysEvents.length === 0,
                'lg:block': todaysEvents.length > 1,
              })}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full w-6 h-6 p-0 bg-slate-300 text-black group hover:bg-slate-400"
                    variant="secondary"
                  >
                    <span className="text-sm font-mono">
                      {todaysEvents.length}
                    </span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-h-[80dvh] md:max-w-[30dvw]">
                  <DialogHeader>
                    <DialogTitle>
                      Events for {format(dateKey, 'EEEE, PP')}
                    </DialogTitle>
                    <DialogDescription>
                      Make sure to make it count, have fun!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-[1px] w-full bg-green-900" />

                  <div className="grid gap-4 max-h-[60vh] overflow-y-auto p-4">
                    <EventsPerDay
                      events={todaysEvents}
                      className="m-0 text-sm py-3 rounded-sm"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <p className="font-bold absolute top-2 left-2 lg:relative lg:mt-0 lg:text-right text-sm lg:font-semibold">
              {format(day, 'd')}
            </p>
            <div className="flex flex-col gap-1 absolute left-0 w-[75%] h-20 rounded-e-sm overflow-y-scroll no-scrollbar py-1">
              <EventsPerDay events={todaysEvents} className="hidden lg:block" />
            </div>
          </DateBlock>
        )
      })}
    </div>
  )
}

const EventsPerDay = ({
  events,
  className,
}: {
  events: Event[]
  className?: string
}) => {
  return events.map(
    (event) =>
      event.status !== 'CANCELLED' && (
        <Link
          to={`/events/detail/${event.id}`}
          key={event.id}
          className={cn(
            'rounded-e-sm px-4 py-2 text-center text-xs text-black bg-white lg:line-clamp-none lg:text-left text-balance',
            className,
            {
              'bg-gray-200': event.status === 'DONE',
              'border-gray-300 border-[1px] border-l-0':
                event.status === 'DRAFT',
              'bg-amber-300 hover:bg-amber-300/80':
                event.status === 'FOR_APPROVAL' || event.status === 'ON_HOLD',
              'bg-green-900 hover:bg-green-900/80 text-white':
                event.status === 'UPCOMING',
            }
          )}
        >
          <p className="font-bold line-clamp-2">{event.title}</p>
          <p>{format(new Date(event.startDateTime), 'hh:mm a')}</p>
        </Link>
      )
  )
}

type DateBlockProps = {
  className?: string
} & MotionProps
const DateBlock = ({ className, ...rest }: DateBlockProps) => {
  return (
    <>
      <motion.div
        className={cn(
          'cols-span-2 lg:rounded-md h-[3.5rem] lg:h-28 my-2 row-span-8 rounded-full border-gray-700/50 bg-white p-2 lg:px-6',
          className
        )}
        {...rest}
      />
    </>
  )
}

const HeaderBlock = ({ items }: { items: string[] }) => {
  return (
    <div className="grid-cols-7 gap-4 py-2 grid">
      {items.map((day) => {
        return (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        )
      })}
    </div>
  )
}

const MonthPagination = ({
  next,
  prev,
}: {
  next: () => void
  prev: () => void
}) => {
  return (
    <div className="flex justify-center lg:py-4">
      <Button
        variant="ghost"
        className="rounded-full lg:py-2 flex-1"
        size="sm"
        onClick={prev}
      >
        <ArrowLeft size={20} />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full lg:py-2 flex-1"
        size="sm"
        onClick={next}
      >
        <ArrowRight size={20} />
      </Button>
    </div>
  )
}

export default Calendar
