import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { useGetAllEvents } from '@/hooks/useFetchEvents'
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
import { motion, MotionProps } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Event {
  id: number
  title: string
  status: string
  date: Date
}

type DateBlockProps = {
  className?: string
} & MotionProps

const Dashboard = () => {
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate)

  // const { data: events, isSuccess } = useGetAllEvents()

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
  // const eventsByDate = useMemo(() => {
  //   return (
  //     isSuccess &&
  //     events.reduce((acc, event) => {
  //       const dateKey = format(event.date, 'yyyy-MM-dd')
  //       return {
  //         ...acc,
  //         [dateKey]: [...(acc[dateKey] || []), event],
  //       }
  //     }, {})
  //   )
  // }, [events])

  // Get event count for the current month
  // const eventCountForCurrentMonth = useMemo(() => {
  //   if (!isSuccess) return 0

  //   return events.filter((event) =>
  //     isWithinInterval(new Date(event.date), {
  //       start: firstDayOfMonth,
  //       end: lastDayOfMonth,
  //     })
  //   ).length
  // }, [events, isSuccess, firstDayOfMonth, lastDayOfMonth])

  const startingDayIndex = getDay(firstDayOfMonth)

  return (
    <section className="relative w-full grid lg:grid-cols-4 p-4 lg:px-0 gap-4">
      <div className="lg:col-span-3 relative">
        <div className="bg-amber-500/30 lg:px-8 px-4 py-2 -m-1 rounded-md">
          <div className="flex justify-between items-end lg:items-center gap-4 pb-4 lg:w-full flex-row py-4 border-b-[1px] border-gray-400 mb-2">
            <div className="relative w-max flex flex-col lg:flex-row items-start justify-start lg:items-center gap-x-4 gap-1">
              <MonthPagination
                prev={() => prevMonth()}
                next={() => nextMonth()}
              />

              <div className="relative w-max">
                <h1 className="text-3xl  font-black dark:text-white">
                  {format(currentMonth, 'MMMM yyyy')}
                </h1>
                <Badge className="absolute -right-10 top-0 bg-gray-700">
                  1
                </Badge>
              </div>
            </div>
            <Button className="rounded-full w-11 h-11 p-2" asChild>
              <Link to="/events/new">
                <Plus />
              </Link>
            </Button>
          </div>
          <HeaderBlock items={WEEKDAYS} />
        </div>

        <div className="relative">
          <AllDays
            startingDayIndex={startingDayIndex}
            daysInMonth={daysInMonth}
            eventsByDate={[]}
          />
        </div>
      </div>
      <div className="border lg:px-8 px-4 py-2 lg:-m-1 rounded-md"></div>
    </section>
  )
}

const DateBlock = ({ className, ...rest }: DateBlockProps) => {
  return (
    <>
      <motion.div
        className={cn(
          'cols-span-2 lg:rounded-md sm:h-20 lg:h-24 my-2 row-span-8 rounded-full border-gray-700/50 bg-white p-4',
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
    <div className="relative grid gap-1 grid-cols-7 lg:gap-4 pt-4  bg-white/30 rounded-md">
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
              'relative flex flex-col gap-2 rounded-md bg-slate-100 font-mono text-base',
              {
                'bg-primary/90': isToday(day),
                'text-white': isToday(day),
              }
            )}
          >
            {/* <p className="text-gray-400 lg:hidden">{format(day, 'EEE')}</p> */}
            <p className="pb-8 font-bold lg:mt-0 lg:text-right text-sm lg:font-normal">
              {format(day, 'd')}
            </p>
            {todaysEvents.map((event) => {
              return (
                <Link
                  to={`/events/detail/${event.id}`}
                  key={event.title}
                  className={cn(
                    'relative left-5 z-10 col-span-12 rounded-md bg-red-700 px-4 py-2 text-center text-xs font-bold text-white hover:bg-red-400 lg:line-clamp-none lg:text-left',
                    {
                      'bg-gray-700 hover:bg-gray-500':
                        event.status === 'UPCOMING',
                    }
                  )}
                >
                  <p>{event.title}</p>
                  <p className="mt-1">{format(event.date, 'hh:mm a')}</p>
                </Link>
              )
            })}
          </DateBlock>
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

export default Dashboard
