import { CurrentLocationWidget } from '@/widgets/current-location'
import { LocationSearchWidget } from '@/widgets/location-search/ui/LocationSearchWidget'

/**
 * 메인 페이지
 * - 현재 위치 날씨
 * - 장소 검색
 * - 즐겨찾기 목록
 */
export const MainPage = () => {
  return (
   <div className="container mx-auto p-4">
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🌤️ 날씨 앱
          </h1>
          <p className="text-gray-600">
            원하는 장소의 날씨를 검색하고 확인하세요
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CurrentLocationWidget />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔍 장소 검색
            </h2>
            <LocationSearchWidget autoNavigate={true} />
          </div>
        </div>

        {/* 즐겨찾기 목록 (향후 추가) */}
        {/* <div className="mt-8">
          <FavoritesList />
        </div> */}
      </div>
    </div>
   </div>
  )
}