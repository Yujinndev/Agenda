import { useGetEventById } from '@/hooks/api/useGetEventById'
import ResultMessage from '@/components/ui/resultMessage'

const EventFinances = ({ id }: { id: string }) => {
  const { data } = useGetEventById(id)

  return (
    <div className="relative ml-auto w-full">
      <ResultMessage label="No finances to show." />
    </div>
  )
}

export default EventFinances
