import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '../useAxiosPrivate'

export const useGetAllPublicGroups = () => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['public-group'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/group/all')
        return response.data?.records
      } catch (error) {
        console.log(error)
      }
    },
  })
}