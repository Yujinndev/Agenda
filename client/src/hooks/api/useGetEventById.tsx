import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

export const useGetEventById = (id: string) => {
  const axios = useAxiosPrivate()
  const navigate = useNavigate()

  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/event/${id}`)
        return response.data
      } catch (error) {
        navigate(-1)
      }
    },
  })
}
