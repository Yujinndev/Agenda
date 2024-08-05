import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetGroupEvents = (id: string) => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['group-events', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/group/events/${id}`)
        return response.data?.records
      } catch (error) {
        console.log(error)
      }
    },
  })
}
