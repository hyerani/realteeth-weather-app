import { useState } from 'react'
import { useFavoriteStore } from './useFavoriteStore'

/**
 * 즐겨찾기 토글 커스텀 훅
 */
export const useFavoriteToggle = (address: string) => {
  const { addFavorite, removeFavorite, getFavoriteByAddress } = useFavoriteStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const favorite = getFavoriteByAddress(address)
  const isAdded = !!favorite

  const toggle = async (onSuccess?: () => void) => {
    setIsLoading(true)
    setError(null)

    try {
      if (isAdded && favorite) {
        removeFavorite(favorite.id)
      } else {
        addFavorite(address)
      }
      onSuccess?.()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        setTimeout(() => setError(null), 3000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { isAdded, isLoading, error, toggle }
}
