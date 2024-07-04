import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetEventById = (id: string) => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(`/event/item/${id}`)
      return response.data
    },
  })
}
