import { ENV } from '@/shared/config/env'
import type {
  CurrentWeatherResponse,
  HourlyForecastResponse,
  WeatherData,
  HourlyWeather,
} from '../model/types'

/**
 * OpenWeatherMap API 기본 설정
 */
const API_CONFIG = {
  BASE_URL: ENV.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  API_KEY: ENV.WEATHER_API_KEY,
  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'kr',
} as const

/**
 * API 요청 URL 생성 헬퍼
 */
const buildUrl = (endpoint: string, params: Record<string, string | number>): string => {
  const url = new URL(`${API_CONFIG.BASE_URL}/${endpoint}`)
  
  url.searchParams.append('appid', API_CONFIG.API_KEY)
  url.searchParams.append('units', API_CONFIG.DEFAULT_UNITS)
  url.searchParams.append('lang', API_CONFIG.DEFAULT_LANG)
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value))
  })
  
  return url.toString()
}

/**
 * API 응답 에러 체크 및 파싱
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP Error: ${response.status} ${response.statusText}`,
    }))
    throw new Error(error.message || 'API 요청에 실패했습니다.')
  }
  
  return response.json()
}

/**
 * 현재 날씨 정보 가져오기
 * @param lat 위도
 * @param lon 경도
 * @returns 현재 날씨 데이터
 */
export const fetchCurrentWeather = async (
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> => {
  const url = buildUrl('weather', { lat, lon })
  const response = await fetch(url)
  return handleResponse<CurrentWeatherResponse>(response)
}

/**
 * 5일 / 3시간 단위 예보 가져오기
 * @param lat 위도
 * @param lon 경도
 * @returns 시간대별 예보 데이터
 */
export const fetchHourlyForecast = async (
  lat: number,
  lon: number
): Promise<HourlyForecastResponse> => {
  const url = buildUrl('forecast', { lat, lon })
  const response = await fetch(url)
  return handleResponse<HourlyForecastResponse>(response)
}

/**
 * 현재 날씨 + 시간대별 예보를 합쳐서 가져오기
 * @param lat 위도
 * @param lon 경도
 * @returns 가공된 날씨 데이터
 */
export const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(lat, lon),
      fetchHourlyForecast(lat, lon),
    ])

    const hourlyWeather: HourlyWeather[] = forecastData.list
      .slice(0, 8)
      .map((item) => ({
        time: item.dt,
        timeText: new Date(item.dt * 1000).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        temp: Math.round(item.main.temp),
        description: item.weather[0]?.description || '',
        icon: item.weather[0]?.icon || '',
        pop: item.pop ? Math.round(item.pop * 100) : undefined,
      }))

    const weatherData: WeatherData = {
      location: currentData.name,
      coordinates: {
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        tempMin: Math.round(currentData.main.temp_min),
        tempMax: Math.round(currentData.main.temp_max),
        humidity: currentData.main.humidity,
        description: currentData.weather[0]?.description || '',
        icon: currentData.weather[0]?.icon || '',
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      },
      hourly: hourlyWeather,
      timestamp: currentData.dt,
    }

    return weatherData
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`날씨 정보를 가져오는데 실패했습니다 ${error.message}`)
    }
    throw new Error('날씨 정보를 가져오는데 실패했습니다.')
  }
}

/**
 * 도시 이름으로 날씨 가져오기
 * @param cityName 도시 이름
 * @returns 현재 날씨 데이터
 */
export const fetchWeatherByCity = async (
  cityName: string
): Promise<CurrentWeatherResponse> => {
  const url = buildUrl('weather', { q: cityName })
  const response = await fetch(url)
  return handleResponse<CurrentWeatherResponse>(response)
}

/**
 * OpenWeatherMap 아이콘 URL 생성
 * @param iconCode 아이콘 코드
 * @param size 아이콘 크기
 * @returns 아이콘 URL
 */
export const getWeatherIconUrl = (
  iconCode: string,
  size: '1x' | '2x' | '4x' = '2x'
): string => {
  const sizeMap = {
    '1x': '',
    '2x': '@2x',
    '4x': '@4x',
  }
  return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size]}.png`
}

/**
 * API 키 유효성 검사
 * @returns API 키가 설정되어 있는지 여부
 */
export const isApiKeyValid = (): boolean => {
  return Boolean(API_CONFIG.API_KEY && API_CONFIG.API_KEY !== 'your_api_key_here')
}