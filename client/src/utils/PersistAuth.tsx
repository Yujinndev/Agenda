import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import useRefreshToken from '@/hooks/useRefreshToken'
import Loading from '@/components/Loading'

const PersistAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    !auth?.accessToken
      ? setTimeout(() => {
          verifyRefreshToken()
        }, 500)
      : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return <Outlet />
}

export default PersistAuth
