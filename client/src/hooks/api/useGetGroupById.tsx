import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetGroupById = (id: string) => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      const response = await axios.get(`/api/group/${id}`)
      return response.data
    },
  })
}
