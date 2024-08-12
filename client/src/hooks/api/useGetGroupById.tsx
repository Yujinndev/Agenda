import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export const useGetGroupById = (id: string) => {
  const axios = useAxiosPrivate()

  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/group/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
      }
    },
  })
}
