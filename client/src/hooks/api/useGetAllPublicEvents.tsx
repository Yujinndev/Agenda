import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const UseGetAllPublicEvents = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['allEvents'],
    queryFn: async () => {
      const response = await axios.get('event/all/public')
      return response.data?.allEvents
    },
  })
}
