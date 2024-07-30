import { useGetEventById } from '@/hooks/api/useGetEventById'
import { format, formatDistance } from 'date-fns'
import { NotepadText, User2 } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { EVENT_COMMITTEE_INQUIRIES } from '@/constants/choices'

const EventHistoryTimeline = ({ id }: { id: string }) => {
  const { auth } = useAuth()
  const { data, isSuccess } = useGetEventById(id)

  const history = isSuccess && data?.eventHistoryLogs

  return (
    <div className="relative">
      {history.map((timeline: any) => {
        const actionTime = new Date(timeline.createdAt)
        const action =
          timeline.action === 'INQUIRED'
            ? timeline?.committeeInquiry?.responseType
            : timeline.action

        const response = EVENT_COMMITTEE_INQUIRIES.find(
          (el) => action === el.value
        )

        const inquiryMessage = timeline?.committeeInquiry?.content

        return (
          <div className="flex gap-x-3" key={timeline.id}>
            <div className="min-w-24 w-24 lg:min-w-40 md:w-40 text-end flex flex-col gap-2">
              <span className="text-xs md:text-sm capitalize w-full">
                {formatDistance(actionTime, new Date(), {
                  addSuffix: true,
                })}
              </span>
              <span className="text-xs md:text-sm text-gray-500 w-full">
                {format(actionTime, 'PPp')}
              </span>
            </div>

            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-2 rounded-full bg-gray-400"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-8">
              <div className="flex flex-col md:flex-row md:items-center font-semibold">
                <span className="underline underline-offset-8">
                  {response?.label}
                </span>
                <span className="text-gray-500 font-normal">
                  : {timeline.message}
                </span>
              </div>
              <p></p>
              {inquiryMessage && (
                <div className="flex gap-2 p-2 my-2 rounded-md items-center bg-slate-200 w-full">
                  <NotepadText
                    className="text-gray-500 flex-shrink-0 self-start mt-[2px]"
                    size={18}
                  />
                  {inquiryMessage}
                </div>
              )}
              {timeline?.email && (
                <div className="flex items-center gap-2 py-4">
                  <User2 className="rounded-full bg-slate-200" />
                  <h2 className="text-red-800">
                    {`@${timeline?.email.split('@')[0]}`}{' '}
                    {timeline.email === auth?.user && '(you)'}
                  </h2>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EventHistoryTimeline
