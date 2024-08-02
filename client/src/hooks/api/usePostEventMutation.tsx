import { useNavigate } from 'react-router-dom'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { toast } from '@/components/ui/use-toast'

type UseCreateEventOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
  invalidateQueryKey: QueryKey
  navigateTo?: string
}

export const usePostEventMutation = (
  apiEndpoint: string,
  options: UseCreateEventOptions
) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const axios = useAxiosPrivate()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(apiEndpoint, { data })
      return response.data
    },
    onSuccess: () => {
      toast({
        description: `Success!`,
        variant: 'success',
      })

      if (options.onSuccess) {
        options.onSuccess()
      }

      if (options.navigateTo) {
        navigate(options.navigateTo, { replace: true })
      }

      return queryClient.invalidateQueries({
        queryKey: options.invalidateQueryKey,
      })
    },
    onError: (error: any) => {
      console.log(error)

      toast({
        title: 'Sorry, failed!',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    },
  })
}
