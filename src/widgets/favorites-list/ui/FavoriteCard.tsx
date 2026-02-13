import { useState } from 'react'
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { getWeatherIconUrl, useWeatherByAddress } from '@/entities/weather'
import { useFavoriteStore } from '@/entities/favorite'
import type { Favorite } from '@/entities/favorite'
import { EditNameModal } from '@/features/edit-favorite-name'


interface FavoriteCardProps {
  favorite: Favorite
  onClick: () => void
}

/**
 * 즐겨찾기 카드 컴포넌트
 */
export const FavoriteCard = ({ favorite, onClick }: FavoriteCardProps) => {
  const { removeFavorite } = useFavoriteStore()
  const { data: weather, isLoading, error } = useWeatherByAddress(favorite.address)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm(`"${favorite.displayName}"을(를) 즐겨찾기에서 삭제하시겠습니까?`)) {
      removeFavorite(favorite.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-16 bg-gray-200 rounded mb-4" />
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded flex-1" />
            <div className="h-10 bg-gray-200 rounded flex-1" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {favorite.displayName}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {favorite.address}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-700">
            ⚠️ 날씨 정보를 불러올 수 없습니다
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                     bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                     transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm font-medium">수정</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                     bg-red-50 text-red-600 rounded-lg hover:bg-red-100
                     transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">삭제</span>
          </button>
        </div>

        <EditNameModal
          favoriteId={favorite.id}
          currentName={favorite.displayName}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    )
  }

  return (
    <>
      <div
        onClick={onClick}
        className="w-full cursor-pointer bg-white rounded-xl p-6 shadow hover:shadow-lg 
                 transition-all duration-200 text-left group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 break-words group-hover:text-blue-600 transition-colors">
              {favorite.displayName}
            </h3>
            <p className="text-sm text-gray-500 flex items-start gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span className="break-words flex-1">{favorite.address}</span>
            </p>
          </div>
          <img
            src={getWeatherIconUrl(weather.current.icon, '2x')}
            alt={weather.current.description}
            className="w-16 h-16 flex-shrink-0"
          />
        </div>

        <div className="mb-4">
          <p className="text-4xl font-bold text-gray-900 mb-1">
            {weather.current.temp}°
          </p>
          <p className="text-sm text-gray-600">{weather.current.description}</p>
        </div>

        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">최저</p>
            <p className="text-lg font-semibold text-blue-600">
              {weather.current.tempMin}°
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">최고</p>
            <p className="text-lg font-semibold text-red-600">
              {weather.current.tempMax}°
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                     bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                     transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm font-medium">수정</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                     bg-red-50 text-red-600 rounded-lg hover:bg-red-100
                     transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">삭제</span>
          </button>
        </div>
      </div>

      <EditNameModal
        favoriteId={favorite.id}
        currentName={favorite.displayName}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}