import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useFavoriteStore, MAX_FAVORITES } from '@/entities/favorite'
import { FavoriteCard } from './FavoriteCard'

/**
 * 즐겨찾기 목록 위젯
 * - 최대 6개까지 표시
 */
export const FavoritesListWidget = () => {
  const navigate = useNavigate()
  const { favorites } = useFavoriteStore()

  const handleCardClick = (address: string) => {
    navigate(`/weather/favorite?name=${encodeURIComponent(address)}`)
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 
                        bg-gray-100 rounded-full mb-4">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          즐겨찾기가 비어있습니다
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          자주 확인하는 장소를 즐겨찾기에 추가해보세요
        </p>
        <p className="text-xs text-gray-400">
          최대 {MAX_FAVORITES}개까지 추가할 수 있습니다
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          즐겨찾기
        </h2>
        <p className="text-sm text-gray-500">
          {favorites.length}/{MAX_FAVORITES}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onClick={() => handleCardClick(favorite.address)}
          />
        ))}
      </div>
    </div>
  )
}