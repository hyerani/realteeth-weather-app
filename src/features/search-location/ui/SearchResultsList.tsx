import { SearchResultCard } from './SearchResultCard'
import type { SearchResult } from '@/entities/location'

interface SearchResultsListProps {
  results: SearchResult[]
  searchQuery: string
  onSelectLocation: (result: SearchResult) => void
  isLoading?: boolean
}

/**
 * 검색 결과 리스트 컴포넌트
 */
export const SearchResultsList = ({
  results,
  searchQuery,
  onSelectLocation,
  isLoading = false,
}: SearchResultsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white border border-gray-200 rounded-lg animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 
                        bg-gray-100 rounded-full mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="text-gray-500">
          장소를 검색하여 날씨를 확인하세요
        </p>
        <p className="text-sm text-gray-400 mt-2">
          예: 서울, 강남구, 삼성동
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 
                        bg-gray-100 rounded-full mb-4">
          <span className="text-3xl">😔</span>
        </div>
        <p className="text-gray-700 font-medium mb-2">
          검색 결과가 없습니다
        </p>
        <p className="text-sm text-gray-500">
          '{searchQuery}'에 대한 결과를 찾을 수 없습니다
        </p>
        <p className="text-xs text-gray-400 mt-3">
          다른 검색어를 입력해보세요
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{results.length}개</span>의
        장소를 찾았습니다
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {results.map((result) => (
          <SearchResultCard
            key={result.district.id}
            district={result.district}
            searchQuery={searchQuery}
            onClick={() => onSelectLocation(result)}
          />
        ))}
      </div>
    </div>
  )
}