import { useSearchParams } from 'react-router-dom'

export const useCustomSearchParams = <T extends Record<string, string>>() => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchAsObject = Object.fromEntries(searchParams.entries()) as T

  const setSearch = (newParams: Partial<T>) => {
    setSearchParams((prev) => {
      const updatedParams = new URLSearchParams(prev)
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined) {
          updatedParams.set(key, value.toString())
        } else {
          updatedParams.delete(key)
        }
      })
      return updatedParams
    })
  }

  return [searchAsObject, setSearch] as const
}
