import { MapPin } from 'lucide-react'
import type { District } from '@/entities/location/model/districtTypes'
import { highlightText } from '@/entities/location/lib/searchDistricts'

interface SearchResultCardProps {
  district: District
  searchQuery: string
  onClick: () => void
}

/**
 * 검색 결과 카드 컴포넌트
 */
export const SearchResultCard = ({
  district,
  searchQuery,
  onClick,
}: SearchResultCardProps) => {
  const parts = highlightText(district.fullName, searchQuery)

  const levelBadgeColors = {
    sido: 'bg-blue-100 text-blue-700',
    sigungu: 'bg-green-100 text-green-700',
    eupmyeondong: 'bg-purple-100 text-purple-700',
  }

  const levelLabels = {
    sido: '시/도',
    sigungu: '시/군/구',
    eupmyeondong: '읍/면/동',
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white border border-gray-200 
                 rounded-lg hover:border-blue-500 hover:shadow-md 
                 transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
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
              className={`px-2 py-0.5 rounded-full font-medium ${
                levelBadgeColors[district.level]
              }`}
            >
              {levelLabels[district.level]}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}