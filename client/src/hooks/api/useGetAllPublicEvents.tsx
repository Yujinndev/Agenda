import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetAllPublicEvents = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/event/all')
        return response.data?.records
      } catch (error) {
        console.log(error)
      }
    },
  })
}
