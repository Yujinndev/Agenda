import EventOverview from '@/components/event/EventOverview'
import EventParticipantsList from '@/components/event/EventParticipantsList'
// import Loading from '@/components/Loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/Tabs'
// import { EVENT_CATEGORIES } from '@/constants/choices'
// import { useGetEventById } from '@/hooks/api/useGetEventById'
import { ArrowUp, ArrowUpRight, CalendarClock, CalendarIcon, Clock, MapPinIcon, Scroll, Ticket, UserRoundCheck, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollTop from '../../components/ui/ScrollToTop'

const EventDetail = () => {
//   const { data, isLoading } = useGetEventById(id as string)
    
//   if (isLoading) {
//     return <Loading />
//   }

//   const eventStatus = EVENT_CATEGORIES.find((el) => el.value === data.status)

  return (
    <div className="w-full pt-8">
      <div className="bg-green-900 px-8 mb-8 rounded-md text-white flex flex-col-reverse justify-between md:flex-row md:items-center">
        <div className="flex flex-1 flex-col items-start gap-1 py-4 pt-8 md:w-2/3 lg:w-1/2">
          <div className="space-x-1 mb-2">
            <Badge
              variant="secondary"
              className="pt-1 bg-yellow-300 text-black"
            >
              {/* {data.category} */} Category
            </Badge>

          
          </div>
          <h1 className="text-4xl dark:text-white md:text-4xl lg:text-5xl">
            {/* {data.title} */} This is my Title.
          </h1>
          <p className='text-[12px] dark:text-white text-zinc-200'>Catch phrase</p>
          <div className='absolute right-0 lg:mr-20 -mt-4 mr-6 md:mr-12'>
          <Button
            size="sm"
            variant="outline"
            className="w-max rounded-full px-6 p-2 h-7"
            asChild
          >
            <Link to="/events/my-events" className="text-black">
              Join Event <ArrowUpRight size={18} className="ms-1 -mt-1" />
            </Link>
          </Button>
          </div>
        </div>
      </div>
      <div className="relative w-full lg:h-[450px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-center bg-cover blur-xl" 
          style={{ backgroundImage: "url('https://www.crucial.com.au/blog/wp-content/uploads/2014/12/events_medium.jpg')" }}>
        </div>
        <img 
          className="relative w-[75%] h-full object-cover mx-auto" 
          src="https://www.crucial.com.au/blog/wp-content/uploads/2014/12/events_medium.jpg" 
          alt="eventImage"
        />
      </div>
        <div className='px-2 mt-5 text-justify lg:w-8/12'>
          <h1 className='text-2xl'>Schedule</h1>
          <h3 className='pb-4 flex flex-row gap-2'>
              <CalendarClock size={20}/>
                <span className='text-gray-600'>Input Date and Time here</span>
          </h3>
          <h1 className='text-2xl mt-14'>Venue</h1>
          <h3 className='pb-4 flex flex-row gap-2'>
              <MapPinIcon size={20} />
                <span className='text-gray-600'>Input Location here</span>
          </h3>
          <h1 className='text-2xl mt-14'>Participants</h1>
          <h3 className='pb-4 flex flex-row gap-2'>
              <UserRoundCheck size={20} />
                <span className='text-gray-600'>Join/Total</span>
          </h3>
          <h1 className='text-2xl mt-14'>Event Fee</h1>
          <h3 className='pb-4 flex flex-row gap-2'>
              <Ticket size={20} />
                <span className='text-gray-600'>P 100</span>
          </h3>
          <h1 className='text-2xl mt-14'>Overview</h1>
          <h3 className='pb-4 flex flex-row gap-2'>
              <Clock size={20}/>
                <span className='text-gray-600'>Time Duration</span>
          </h3>
          <p className='mt-5 px-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Aliquam id diam maecenas ultricies. Aenean sed adipiscing diam donec. 
            Ultricies mi quis hendrerit dolor magna eget est lorem ipsum. Facilisi 
            morbi tempus iaculis urna id volutpat lacus. Eros in cursus turpis massa 
            tincidunt dui ut. Vel eros donec ac odio tempor orci dapibus. Diam volutpat 
            commodo sed egestas egestas. Felis imperdiet proin fermentum leo. Ridiculus 
            mus mauris vitae ultricies. Nulla posuere sollicitudin aliquam ultrices sagittis. 
            Ac turpis egestas sed tempus.</p>
          <h1 className='text-2xl mt-14'>Organizer Info</h1>
          <h3 className='pb-4 flex flex-row gap-2'>
              <UsersIcon size={20}/>
                <span className='text-gray-600'>Organizer Details</span>
          </h3>
        </div>
        <ScrollTop />
        </div>
  )
}

export default EventDetail
