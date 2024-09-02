import axios from '@/lib/axios'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')

      setAuth({})
      navigate('/', { replace: true })
    } catch (err) {
      console.log(err)
    }
  }

  return logout
}

export default useLogout
