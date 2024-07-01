import axios from '@/lib/axios'
import useAuth from './useAuth'

const useLogout = () => {
  const { setAuth } = useAuth()

  const logout = async () => {
    try {
      await axios.post('/auth/logout')

      setAuth({})
    } catch (err) {
      console.error(err)
    }
  }

  return logout
}

export default useLogout
