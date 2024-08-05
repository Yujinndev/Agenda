import { FaUserSecret } from 'react-icons/fa6'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ResultMessage from '@/components/ui/resultMessage'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import ReadFeedbackDialog from './ReadFeedbackDialog'

const EventParticipantsList = ({ id }: { id: string }) => {
  const { data } = useGetEventById(id)
  const participants = data?.participants

  return (
    <div className="relative ml-auto w-full">
      {participants?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-h-40">
          {participants.map((item: any, idx: number) => {
            const userFeedback = data?.eventFeedbacks.find(
              (el: any) => el.userId === item.userId
            )

            return (
              <Card
                key={idx}
                className="relative flex flex-col items-center justify-around p-4 gap-4"
              >
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="p-8 rounded-full"
                >
                  <FaUserSecret size={40} className="flex-shrink-0" />
                </Button>

                <p className="text-center text-lg font-bold line-clamp-2">
                  {item.name}
                </p>
                {userFeedback && (
                  <ReadFeedbackDialog
                    user={item.name}
                    content={userFeedback.content}
                    rating={userFeedback.rating}
                    time={userFeedback.createdAt}
                  />
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <ResultMessage label="No participants to show." />
      )}
    </div>
  )
}

export default EventParticipantsList
