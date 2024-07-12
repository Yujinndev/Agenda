import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetEventById = (id: string) => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(`/api/event/${id}`)
      return response.data
    },
  })
}
