import { MapPin, Star } from 'lucide-react'
import { highlightText, type District } from '@/entities/location'
import { useFavoriteToggle } from '@/entities/favorite'
import { cn } from '@/shared'


interface SearchResultCardProps {
  district: District
  searchQuery: string
  onClick: () => void
}

const LEVEL_BADGE_COLORS = {
  sido: 'bg-blue-100 text-blue-700',
  sigungu: 'bg-green-100 text-green-700',
  eupmyeondong: 'bg-purple-100 text-purple-700',
} as const

const LEVEL_LABELS = {
  sido: '시/도',
  sigungu: '시/군/구',
  eupmyeondong: '읍/면/동',
} as const

/**
 * 검색 결과 카드 컴포넌트
 */
export const SearchResultCard = ({
  district,
  searchQuery,
  onClick,
}: SearchResultCardProps) => {
  const parts = highlightText(district.fullName, searchQuery)
  const { isAdded, error, toggle } = useFavoriteToggle(district.fullName)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggle()
  }

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className="w-full cursor-pointer text-left p-4 bg-white border border-gray-200
                   rounded-lg hover:border-blue-500 hover:shadow-md
                   transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full
                          flex items-center justify-center group-hover:bg-blue-100
                          transition-colors">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {parts.map((part, index) => (
                <span
                  key={index}
                  className={part.highlight ? 'text-blue-600' : ''}
                >
                  {part.text}
                </span>
              ))}
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full font-medium",
                  LEVEL_BADGE_COLORS[district.level],
                )}
              >
                {LEVEL_LABELS[district.level]}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={cn(
              "flex-shrink-0 p-2 rounded-full transition-all duration-200",
              isAdded
                ? "bg-yellow-100 hover:bg-yellow-200"
                : "bg-gray-100 hover:bg-gray-200",
            )}
            title={isAdded ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
          >
            <Star
              className={cn(
                "w-5 h-5",
                isAdded ? "fill-yellow-500 text-yellow-500" : "text-gray-400",
              )}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3
                        bg-red-50 border border-red-200 rounded-lg
                        text-sm text-red-600 z-10 shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
