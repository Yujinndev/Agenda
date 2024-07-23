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
  console.log('🚀 ~ apiEndpoint:', apiEndpoint)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const axios = useAxiosPrivate()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(apiEndpoint, { data })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: options.invalidateQueryKey })

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
    },
    onError: (error: any) => {
      console.log('🚀 ~ event mutation:', error)

      toast({
        description: `Failed!`,
        variant: 'destructive',
      })
    },
  })
}