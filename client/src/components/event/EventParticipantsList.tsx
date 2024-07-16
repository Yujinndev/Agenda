import { Card } from '@/components/ui/card'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { User } from 'lucide-react'

const EventParticipantsList = ({ id }: { id: string }) => {
  const { data } = useGetEventById(id)
  const participants = data.participants

  return (
    <div className="relative ml-auto">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-h-40">
        {/* <Card className="relative flex flex-col items-center justify-center gap-4 p-4">
          <AddGuest id={id} />
          <p className="text-base text-center">Invite Participants</p>
        </Card> */}
        {participants.map((item: { name: string }, idx: number) => (
          <Card
            key={idx}
            className="relative flex flex-col items-center justify-around p-4"
          >
            <User size={50} />
            <p className="text-center text-base font-bold line-clamp-2">
              {item.name}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default EventParticipantsList
