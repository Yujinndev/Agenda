import axios from '@/lib/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get('/api/refresh-token')

    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        userId: response.data.userId,
        user: response.data.email,
      }
    })
    return response.data.accessToken
  }
  return refresh
}

export default useRefreshToken
