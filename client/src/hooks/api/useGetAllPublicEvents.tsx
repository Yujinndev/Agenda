import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetAllPublicEvents = (page: number) => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['public-events', page],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/event/public/${page}`)
        return response.data?.events
      } catch (error) {
        console.log(error)
      }
    },
  })
}
