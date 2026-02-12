import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getWeatherIconUrl } from '@/entities/weather'
import { useWeatherByAddress } from '@/entities/weather/model/useWeatherQuery'
import { AddFavoriteButton } from '@/features/add-favorite/ui/AddFavoriteButton'


/**
 * 날씨 상세 페이지
 * - 검색 결과에서 장소 선택 시
 * - 즐겨찾기 카드 클릭 시
 */
export const WeatherDetailPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const address = searchParams.get('name') || '알 수 없는 장소'

  const { data: weather, isLoading, error } = useWeatherByAddress(address)

  const handleGoBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-600">날씨 정보를 가져오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>

          <div className="bg-white rounded-lg p-8 text-center shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 
                            bg-yellow-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              해당 장소의 정보가 제공되지 않습니다.
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">{address}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {error?.message || 'OpenWeatherMap에서 해당 지역의 날씨 데이터를 제공하지 않습니다.'}
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors"
            >
              다른 장소 검색
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>돌아가기</span>
        </button>

        <div className="mb-6">
          <div className="flex items-start justify-between gap-2 md:gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words flex-1">
              {address}
            </h1>
            <div className="flex-shrink-0 mt-1">
              <AddFavoriteButton address={address} size="sm" />
            </div>
          </div>
          <p className="text-gray-500">
            {new Date(weather.timestamp * 1000).toLocaleString('ko-KR')} 기준
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-6xl font-bold mb-2">{weather.current.temp}°C</p>
              <p className="text-xl mb-1">{weather.current.description}</p>
              <p className="text-sm opacity-90">
                체감 {weather.current.feelsLike}°C
              </p>
            </div>
            <img
              src={getWeatherIconUrl(weather.current.icon, '4x')}
              alt={weather.current.description}
              className="w-32 h-32"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-sm opacity-80 mb-1">최저 기온</p>
              <p className="text-2xl font-semibold">{weather.current.tempMin}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">최고 기온</p>
              <p className="text-2xl font-semibold">{weather.current.tempMax}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">습도</p>
              <p className="text-2xl font-semibold">{weather.current.humidity}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            시간대별 기온
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {weather.hourly.map((hour) => {
              const isMidnight = new Date(hour.time * 1000).getHours() === 0
              const isTomorrow =
                new Date(hour.time * 1000).getDate() !==
                new Date(weather.timestamp * 1000).getDate()

              return (
                <div
                  key={hour.time}
                  className="text-center p-3 bg-gray-50 rounded-lg relative"
                >
                  {isMidnight && isTomorrow && (
                    <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-medium pt-1">
                      내일
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mb-2 pt-2">{hour.timeText}</p>
                  <img
                    src={getWeatherIconUrl(hour.icon)}
                    alt={hour.description}
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <p className="font-semibold text-gray-900">{hour.temp}°C</p>
                  {hour.pop !== undefined && hour.pop > 0 && (
                    <p className="text-xs text-blue-500 mt-1">💧 {hour.pop}%</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}