import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetUserEvents = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const response = await axios.get('/api/event/me/all')
      return response.data?.events?.records
    },
  })
}
