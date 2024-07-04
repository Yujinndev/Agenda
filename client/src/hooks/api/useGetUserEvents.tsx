import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useUserEvents = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['myEvents'],
    queryFn: async () => {
      const response = await axios.get('/event/myEvents')
      return response.data.userEvents
    },
  })
}
