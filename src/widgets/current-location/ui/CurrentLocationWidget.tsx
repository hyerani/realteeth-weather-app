import { useAutoGeolocation } from '@/entities/location'
import { useWeatherData, getWeatherIconUrl } from '@/entities/weather'
import { cn } from '@/shared/lib/utils/cn'
import { HourlyForecastScroll } from './HourlyForecastScroll'

/**
 * 현재 위치의 날씨를 표시하는 위젯
 */
export const CurrentLocationWidget = () => {
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
      <div className="animate-fade-in bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">📍 현재 위치 날씨</p>
          <p className="text-sm opacity-90 mb-4">
            현재 위치의 날씨를 확인하려면 위치 권한이 필요합니다
          </p>
          <button
            onClick={requestLocation}
            className={cn(
              "bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold",
              "hover:bg-blue-50 transition-colors"
            )}
          >
            위치 권한 허용
          </button>
        </div>
      </div>
    )
  }

  if (locationError) {
    return (
      <div className="animate-fade-in bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">
            ❌ 위치를 가져올 수 없습니다
          </p>
          <p className="text-sm text-red-500 mb-4">{locationError.message}</p>
          <button
            onClick={requestLocation}
            className={cn(
              "bg-red-500 text-white px-6 py-2 rounded-lg",
              "hover:bg-red-600 transition-colors"
            )}
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (weatherError && !isLocationLoading && !isWeatherLoading) {
    return (
      <div className="animate-fade-in bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <div className="text-center">
          <p className="text-yellow-600 font-semibold mb-2">
            ⚠️ 날씨 정보를 가져올 수 없습니다
          </p>
          <p className="text-sm text-yellow-500">{weatherError.message}</p>
        </div>
      </div>
    )
  }

  const isLoading = isLocationLoading || isWeatherLoading || !weather

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-7 bg-white/20 rounded w-36 mb-2" />
              <div className="h-5 bg-white/20 rounded w-28" />
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full" />
          </div>
          <div className="mb-6">
            <div className="h-14 bg-white/20 rounded w-40 mb-2" />
            <div className="h-6 bg-white/20 rounded w-24" />
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="h-4 bg-white/20 rounded w-14 mb-2" />
                <div className="h-7 bg-white/20 rounded w-16" />
              </div>
              <div>
                <div className="h-4 bg-white/20 rounded w-14 mb-2" />
                <div className="h-7 bg-white/20 rounded w-16" />
              </div>
              <div>
                <div className="h-4 bg-white/20 rounded w-10 mb-2" />
                <div className="h-7 bg-white/20 rounded w-14" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="h-4 bg-white/20 rounded w-24 mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[18%] min-w-[70px]">
                  <div className="bg-white/10 rounded p-2 space-y-1.5">
                    <div className="h-3 bg-white/20 rounded w-10 mx-auto" />
                    <div className="w-6 h-6 bg-white/20 rounded-full mx-auto" />
                    <div className="h-3 bg-white/20 rounded w-10 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="animate-fade-slide-up flex items-center justify-between mb-6">
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

          <div
            className="animate-fade-slide-up mb-6 delay-80"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-6xl font-bold">{weather.current.temp}°C</p>
              <p className="text-xl opacity-80">
                체감 {weather.current.feelsLike}°C
              </p>
            </div>
            <p className="text-xl">{weather.current.description}</p>
          </div>

          <div
            className="animate-fade-slide-up grid grid-cols-3 gap-4 pt-4 border-t border-white/20 delay-160"
          >
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

          <div
            className="animate-fade-slide-up mt-6 pt-4 border-t border-white/20 delay-240"
          >
            <p className="text-sm opacity-80 mb-3">시간대별 예보</p>
            <HourlyForecastScroll hourly={weather.hourly} timestamp={weather.timestamp} />
          </div>
        </>
      )}
    </div>
  )
}
