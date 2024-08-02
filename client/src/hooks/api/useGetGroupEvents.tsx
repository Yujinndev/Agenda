import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetGroupEvents = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['public-group-events'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/group/event/all')
        return response.data?.records
      } catch (error) {
        console.log(error)
      }
    },
  })
}
