import Loading from '@/components/Loading'
import { useGetEventById } from '@/hooks/api/useGetEventById'
import { useParams } from 'react-router-dom'

const EventDetails = () => {
  const { id } = useParams()
  const { data, isLoading } = useGetEventById(id as string)

  if (isLoading) {
    return <Loading />
  }

  return <pre className="">{JSON.stringify(data, null, 2)}</pre>
}

export default EventDetails
