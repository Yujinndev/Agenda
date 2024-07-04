import { Card } from '@/components/ui/card'

const MyEvents = () => {
  return (
    <div className="grid grid-cols-4 w-full gap-4 py-20">
      {Array.from(['For Approval', 'Upcoming', 'Cancelled', 'Done']).map(
        (el, index) => (
          <Card className="flex justify-center h-96">{el}</Card>
        )
      )}
    </div>
  )
}

export default MyEvents
