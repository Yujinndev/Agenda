import EventCard from '@/components/EventCard'
import { Event } from '@/components/Calendar'
import { useGetAllPublicEvents } from '@/hooks/api/useGetAllPublicEvents'
import Loading from '@/components/Loading'
import { Link, useNavigate } from 'react-router-dom'
import ResultMessage from '@/components/ui/resultMessage'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const EventsPage = () => {
  const navigate = useNavigate()

  const [search] = useCustomSearchParams()
  const currentPage = Number(search.page || 1)
  const { data: allEvents, isLoading } = useGetAllPublicEvents(currentPage)

  if (isLoading) {
    return <Loading />
  }

  const handleNext = () => {
    const params = new URLSearchParams({
      page: (currentPage + 1).toString(),
    })
    navigate(`/events/browse?${params}`)
  }
  const handlePrev = () => {
    const params = new URLSearchParams({
      page: (currentPage - 1).toString(),
    })
    navigate(`/events/browse?${params}`)
  }
  const handleJumpPage = (index: number) => {
    const params = new URLSearchParams({
      page: index.toString(),
    })
    navigate(`/events/browse?${params}`)
  }

  const TOTAL_ITEMS_PER_PAGE = 16
  const VISIBLE_PAGE_NUMBERS = 3
  const NUMBER_OF_PAGES = Math.ceil(allEvents.totalCount / TOTAL_ITEMS_PER_PAGE)

  // Function to get the range of pages to display
  const getPaginationItems = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage - 1)
    let end = Math.min(start + VISIBLE_PAGE_NUMBERS - 1, totalPages)

    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - VISIBLE_PAGE_NUMBERS + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <section className="relative w-full py-4 lg:px-0 gap-4 lg:pt-10">
      <div className="bg-green-900 lg:px-8 p-4 lg:pb-4 rounded-md sticky">
        <div className="md:w-2/3 py-2 lg:w-1/2 text-white">
          <h1 className="text-3xl">Explore and Join Events</h1>
          <p>Events are happening every day— join the fun.</p>
        </div>
      </div>

      {allEvents.records.length > 0 ? (
        <div className="space-y-12">
          <div className="min-h-[65dvh]">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-6">
              {allEvents.records.map((event: Event) => (
                <Link
                  key={event.id}
                  to={`/events/browse/p/${event.id}`}
                  className="p-2"
                >
                  <EventCard event={event} extendedVariant={true} />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 justify-center items-center lg:items-end">
            <p className="text-xs">
              {`Displaying
              ${
                allEvents.totalCount <= TOTAL_ITEMS_PER_PAGE
                  ? allEvents.totalCount
                  : TOTAL_ITEMS_PER_PAGE
              }
               items of ${allEvents.totalCount} events ...`}
            </p>
            <div className="relative">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {getPaginationItems(currentPage, NUMBER_OF_PAGES).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handleJumpPage(Number(page))}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNext}
                      disabled={currentPage === NUMBER_OF_PAGES}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      ) : (
        <ResultMessage label="No events to show." />
      )}
    </section>
  )
}

export default EventsPage
