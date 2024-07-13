import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetRequestedEventsForCommitteeUser = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['requested-events-committee'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/event/me/c/requests')
        return response.data?.records
      } catch (error) {
        console.log(error)
      }
    },
  })
}
