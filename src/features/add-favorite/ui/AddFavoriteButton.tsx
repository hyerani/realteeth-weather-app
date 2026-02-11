import { Star } from 'lucide-react'
import { useFavoriteStore, MAX_FAVORITES } from '@/entities/favorite'
import { useState } from 'react'

interface AddFavoriteButtonProps {
  address: string
  onSuccess?: () => void
}

/**
 * 즐겨찾기 추가/삭제 버튼
 */
export const AddFavoriteButton = ({ address, onSuccess }: AddFavoriteButtonProps) => {
  const { favorites, addFavorite, removeFavorite, isFavorite, getFavoriteByAddress } =
    useFavoriteStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const favorite = getFavoriteByAddress(address)
  const isAdded = isFavorite(address)

  const handleToggle = async () => {
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

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${
            isAdded
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <Star
          className={`w-5 h-5 ${isAdded ? 'fill-yellow-500' : ''}`}
        />
        <span>{isAdded ? '즐겨찾기 삭제' : '즐겨찾기 추가'}</span>
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 whitespace-nowrap z-10">
          {error}
        </div>
      )}

      {!isAdded && favorites.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {favorites.length}/{MAX_FAVORITES}개 추가됨
        </p>
      )}
    </div>
  )
}