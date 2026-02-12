import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAutoGeolocation } from '@/entities/location'
import { useWeatherData, getWeatherIconUrl } from '@/entities/weather'

/**
 * 현재 위치의 날씨를 표시하는 위젯
 */
export const CurrentLocationWidget = () => {
  const [startIndex, setStartIndex] = useState(0)
  const {
    coordinates,
    address,
    isLoading: isLocationLoading,
    error: locationError,
    hasPermission,
    requestLocation,
  } = useAutoGeolocation()

  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useWeatherData(
    coordinates?.lat ?? null,
    coordinates?.lon ?? null,
    {
      enabled: Boolean(coordinates),
    }
  )

  if (!hasPermission) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">📍 현재 위치 날씨</p>
          <p className="text-sm opacity-90 mb-4">
            현재 위치의 날씨를 확인하려면 위치 권한이 필요합니다
          </p>
          <button
            onClick={requestLocation}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            위치 권한 허용
          </button>
        </div>
      </div>
    )
  }

  if (isLocationLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
          <p className="text-lg">현재 위치 확인 중...</p>
        </div>
      </div>
    )
  }

  if (locationError) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">
            ❌ 위치를 가져올 수 없습니다
          </p>
          <p className="text-sm text-red-500 mb-4">{locationError.message}</p>
          <button
            onClick={requestLocation}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (isWeatherLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-6 bg-white/20 rounded w-32 mb-2" />
              <div className="h-4 bg-white/20 rounded w-24" />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full" />
          </div>
          <div className="h-12 bg-white/20 rounded w-24 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-8 bg-white/20 rounded" />
            <div className="h-8 bg-white/20 rounded" />
            <div className="h-8 bg-white/20 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (weatherError) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <div className="text-center">
          <p className="text-yellow-600 font-semibold mb-2">
            ⚠️ 날씨 정보를 가져올 수 없습니다
          </p>
          <p className="text-sm text-yellow-500">{weatherError.message}</p>
        </div>
      </div>
    )
  }

  if (!weather) return null

    const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1)
    }
  }

  const handleNext = () => {
    if (startIndex < weather.hourly.length - 4) {
      setStartIndex(startIndex + 1)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 md:p-8 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📍</span>
            <h2 className="text-2xl font-bold">현재 위치</h2>
          </div>
          <p className="text-lg opacity-90">{address || weather.location}</p>
        </div>
        <img
          src={getWeatherIconUrl(weather.current.icon, '4x')}
          alt={weather.current.description}
          className="w-20 h-20"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-6xl font-bold">{weather.current.temp}°C</p>
          <p className="text-xl opacity-80">
            체감 {weather.current.feelsLike}°C
          </p>
        </div>
        <p className="text-xl">{weather.current.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
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

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm opacity-80">시간대별 예보</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors 
              ${startIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 px-1 py-1">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {weather.hourly.slice(startIndex, startIndex + 4).map((hour) => {
                const isMidnight = new Date(hour.time * 1000).getHours() === 0
                const isTomorrow =
                  new Date(hour.time * 1000).getDate() !==
                  new Date(weather.timestamp * 1000).getDate()

                return (
                  <div key={hour.time} className="relative pt-3">
                    {isMidnight && isTomorrow && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] bg-white/20 px-1.5 rounded-full text-white font-medium whitespace-nowrap z-10 border border-white/10 shadow-sm">
                        내일
                      </span>
                    )}
                    <div className="text-center bg-white/10 rounded p-1.5 sm:p-2 min-w-0">
                      <p className="text-[10px] sm:text-xs opacity-80 truncate">{hour.timeText}</p>
                      <img
                        src={getWeatherIconUrl(hour.icon, '1x')}
                        alt={hour.description}
                        className="w-6 h-6 sm:w-8 sm:h-8 mx-auto my-0.5 sm:my-1"
                      />
                      <p className="text-xs sm:text-sm font-semibold truncate">{hour.temp}°C</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button 
            onClick={handleNext}
            disabled={startIndex >= weather.hourly.length - 4}
            className={`p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors
              ${startIndex >= weather.hourly.length - 4 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'} flex-shrink-0`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}