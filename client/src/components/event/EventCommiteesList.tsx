import { User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ResultMessage from '@/components/ui/resultMessage'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { Badge } from '@/components/ui/badge'

export type Committee = {
  name: string
  email: string
  approvalStatus: 'WAITING' | 'REQUESTING_REVISION' | 'REJECTED' | 'APPROVED'
}

const EventCommitteesList = ({ id }: { id: string }) => {
  const { data } = useGetEventById(id)
  const committees = data?.committees

  return (
    <div className="relative ml-auto w-full">
      {committees?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-h-40">
          {committees.map((committee: Committee) => (
            <Card
              key={committee.email}
              className="relative flex flex-col items-center justify-around p-4 gap-4"
            >
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="p-12 rounded-full"
              >
                <User size={50} className="flex-shrink-0" />
              </Button>

              <Badge>{committee.approvalStatus}</Badge>
              <p className="text-center text-lg font-bold line-clamp-2">
                {committee.name}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <ResultMessage label="No committees to show." />
      )}
    </div>
  )
}

export default EventCommitteesList
