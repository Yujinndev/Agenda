import { Card } from '@/components/ui/card'

const MyEvents = () => {
  return (
    <div className="grid grid-cols-4 w-full gap-4 py-20">
      {Array.from(['For Approval', 'Upcoming', 'Cancelled', 'Done']).map(
        (el, index) => (
          <Card key={index} className="flex justify-center h-96 py-8">
            {el}
          </Card>
        )
      )}
    </div>
  )
}

export default MyEvents
