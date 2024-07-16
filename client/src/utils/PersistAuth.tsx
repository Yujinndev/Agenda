import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import useRefreshToken from '@/hooks/useRefreshToken'
import Loading from '@/components/Loading'

const PersistAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()
  const refresh = useRefreshToken()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return <Outlet />
}

export default PersistAuth
