import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ResultMessage from '@/components/ui/resultMessage'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { Badge } from '@/components/ui/badge'
import { FaUserSecret } from 'react-icons/fa6'

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
                className="p-8 rounded-full"
              >
                <FaUserSecret size={40} className="flex-shrink-0" />
              </Button>

              <Badge>{committee.approvalStatus}</Badge>
              <div className="text-center text-lg font-bold line-clamp-2">
                {committee.name || (
                  <div className="grid">
                    {committee.email}
                    <small className="text-slate-300">
                      EXTERNAL ~ NOT A USER
                    </small>
                  </div>
                )}
              </div>
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
