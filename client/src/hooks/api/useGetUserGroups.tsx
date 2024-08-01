import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetUserGroups = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['my-groups'],
    queryFn: async () => {
      const response = await axios.get('/api/event/group/me/all')
      return response.data?.records
    },
  })
}
