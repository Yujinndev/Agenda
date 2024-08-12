import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export const useGetUserGroups = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['my-groups'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/group/me/all')
        return response.data?.records
      } catch (error) {
        console.log(error)
      }
    },
  })
}
