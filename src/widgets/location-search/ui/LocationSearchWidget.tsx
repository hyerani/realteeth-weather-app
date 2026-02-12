import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchInput, SearchResultsList } from '@/features/search-location'
import { useDistrictSearch, type SearchResult } from '@/entities/location'

interface LocationSearchWidgetProps {
  onSelectLocation?: (result: SearchResult) => void
  autoNavigate?: boolean
}

/**
 * 장소 검색 위젯
 * 검색 입력 + 결과 리스트를 통합한 컴포넌트
 */
export const LocationSearchWidget = ({
  onSelectLocation,
  autoNavigate = true,
}: LocationSearchWidgetProps) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: results } = useDistrictSearch(searchQuery)

  const handleSelectLocation = (result: SearchResult) => {
    onSelectLocation?.(result)

    if (autoNavigate) {
      navigate(
        `/weather/${result.district.id}?name=${encodeURIComponent(result.district.fullName)}`
      )
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          autoFocus
        />
      </div>

      <SearchResultsList
        results={results}
        searchQuery={searchQuery}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  )
}