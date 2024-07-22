import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import EventList from '@/components/event/EventsList'
import { useGetUserEvents } from '@/hooks/api/useGetUserEvents'
import { Event } from '@/components/Calendar'
import { EVENT_CATEGORIES } from '@/constants/choices'

const MyEvents = () => {
  const [selectedFilter, setSelectedFilter] = useState({
    label: 'Upcoming',
    value: 'UPCOMING',
  })
  const { data: events, isSuccess } = useGetUserEvents()

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4 lg:pt-10">
      <div className="bg-green-900 lg:px-8 p-4 lg:pb-4 rounded-md">
        <div className="pb-6 md:w-2/3 pt-2 lg:w-1/2">
          <h1 className="text-3xl text-white">See your scheduled Events</h1>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 md:flex-row overflow-hidden">
          <div className="flex flex-1 items-center justify-around gap-2 rounded-xl border bg-white overflow-hidden p-2 py-3 md:flex-none flex-wrap">
            {EVENT_CATEGORIES.map((el, idx) => {
              const eventCategoriesLength =
                isSuccess &&
                events.filter((event: Event) => event.status == el.value).length

              return (
                <div key={idx} className="relative">
                  <Button
                    onClick={() =>
                      setSelectedFilter({ label: el.label, value: el.value })
                    }
                    variant="ghost"
                    size="sm"
                    className="relative flex-1 lg:p-4 py-2 text-sm"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <p
                      className={cn(
                        'relative z-50 block text-gray-600 mt-1 dark:text-white',
                        {
                          'text-black': selectedFilter.value === el.value,
                        }
                      )}
                    >
                      {el.label}
                    </p>
                    {selectedFilter.value === el.value && (
                      <motion.div
                        layoutId="clickedbutton"
                        transition={{
                          type: 'spring',
                          bounce: 0.25,
                          duration: 0.5,
                        }}
                        className="absolute inset-0 z-10 rounded-md bg-amber-300 dark:bg-zinc-800"
                      />
                    )}
                  </Button>
                  {eventCategoriesLength > 0 && (
                    <span className="text-xs font-mono absolute -top-1 -left-1 h-3 w-3 p-2 text-center flex items-center justify-center bg-green-900 text-white rounded-full">
                      {eventCategoriesLength}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-2">
            <Button
              className="rounded-full w-11 h-11 p-2"
              variant="outline"
              asChild
            >
              <Link to="/events/new">
                <Plus color="black" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-max rounded-full px-6 py-5"
              asChild
            >
              <Link to="/dashboard">
                View Dashboard <ArrowUpRight size={18} className="ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 py-8 px-6">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-bold dark:text-gray-300 md:text-xl">
            {selectedFilter.label} events
          </p>
        </div>

        {isSuccess && (
          <EventList
            events={events.filter(
              (event: Event) => event.status == selectedFilter.value
            )}
            selectedFilter={selectedFilter.value}
          />
        )}
      </div>
    </section>
  )
}

export default MyEvents
