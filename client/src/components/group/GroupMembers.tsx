import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ResultMessage from '@/components/ui/resultMessage'
import { MdAdminPanelSettings } from 'react-icons/md'
import { MdPerson } from 'react-icons/md'
import { useGetGroupById } from '@/hooks/api/useGetGroupById'

const GroupMembers = ({ id }: { id: string }) => {
  const { data } = useGetGroupById(id)
  const members = data?.members

  return (
    <div className="relative ml-auto w-full">
      {members?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-h-40">
          {members.map((item: { name: string; role: string }, idx: number) => (
            <Card
              key={idx}
              className="relative flex flex-col items-center justify-around p-4 gap-4"
            >
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="p-8 rounded-full cursor-default"
              >
                {item.role === 'ADMIN' ? (
                  <MdAdminPanelSettings size={40} className="flex-shrink-0" />
                ) : (
                  <MdPerson size={40} className="flex-shrink-0" />
                )}
              </Button>

              <p className="text-center text-lg font-bold line-clamp-2">
                {item.name}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <ResultMessage label="No participants to show." />
      )}
    </div>
  )
}

export default GroupMembers
