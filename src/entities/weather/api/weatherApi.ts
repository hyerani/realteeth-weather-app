
import { geocodeAddress } from '@/entities/location'
import type {
  OneCallResponse,
  WeatherData,
  HourlyWeather,
} from '../model/types'
import { ENV } from '@/shared'

/**
 * OpenWeatherMap API 기본 설정
 */
const API_CONFIG = {
  BASE_URL: ENV.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/3.0/onecall',
  API_KEY: ENV.WEATHER_API_KEY,
  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'kr',
} as const

/**
 * API 요청 URL 생성
 */
const buildUrl = (params: Record<string, string | number>): string => {
  const url = new URL(API_CONFIG.BASE_URL)

  url.searchParams.append('appid', API_CONFIG.API_KEY)
  url.searchParams.append('units', API_CONFIG.DEFAULT_UNITS)
  url.searchParams.append('lang', API_CONFIG.DEFAULT_LANG)
  url.searchParams.append('exclude', 'minutely,alerts')

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
 * 날씨 정보 가져오기
 * @param lat
 * @param lon
 * @returns One Call 응답 데이터
 */
const fetchOneCall = async (
  lat: number,
  lon: number
): Promise<OneCallResponse> => {
  const url = buildUrl({ lat, lon })
  const response = await fetch(url)
  return handleResponse<OneCallResponse>(response)
}

/**
 * API 응답을 WeatherData 형식으로 변환
 */
const mapOneCallToWeatherData = (
  location: string,
  data: OneCallResponse
): WeatherData => {
  const hourlyWeather: HourlyWeather[] = data.hourly
    .slice(0, 24)
    .map((item) => ({
      time: item.dt,
      timeText: new Date(item.dt * 1000).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      temp: Math.round(item.temp),
      description: item.weather[0]?.description || '',
      icon: item.weather[0]?.icon || '',
      pop: Math.round(item.pop * 100),
    }))

  const today = data.daily[0]

  return {
    location,
    coordinates: {
      lat: data.lat,
      lon: data.lon,
    },
    current: {
      temp: Math.round(data.current.temp),
      feelsLike: Math.round(data.current.feels_like),
      tempMin: Math.round(today.temp.min),
      tempMax: Math.round(today.temp.max),
      humidity: data.current.humidity,
      pop: Math.round(today.pop * 100),
      description: data.current.weather[0]?.description || '',
      icon: data.current.weather[0]?.icon || '',
      sunrise: data.current.sunrise,
      sunset: data.current.sunset,
    },
    hourly: hourlyWeather,
    timestamp: data.current.dt,
  }
}

/**
 * 좌표로 날씨 데이터 가져오기
 * @param lat
 * @param lon
 * @returns 가공된 날씨 데이터
 */
export const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const data = await fetchOneCall(lat, lon)
    return mapOneCallToWeatherData(data.timezone, data)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`날씨 정보를 가져오는데 실패했습니다 ${error.message}`)
    }
    throw new Error('날씨 정보를 가져오는데 실패했습니다.')
  }
}

/**
 * 주소로 날씨 데이터 가져오기
 *
 * @param address
 * @returns 가공된 날씨 데이터
 */
export const fetchWeatherByAddress = async (
  address: string
): Promise<WeatherData> => {
  try {
    const coords = await geocodeAddress(address)
    const data = await fetchOneCall(coords.lat, coords.lon)
    return mapOneCallToWeatherData(address, data)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`날씨 정보를 가져오는데 실패했습니다 ${error.message}`)
    }
    throw new Error('날씨 정보를 가져오는데 실패했습니다.')
  }
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