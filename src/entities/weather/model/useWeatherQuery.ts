import { useQuery, useQueries, type UseQueryResult } from '@tanstack/react-query'
import { fetchWeatherData, fetchCurrentWeather, isApiKeyValid } from '../api/weatherApi'
import type { WeatherData, CurrentWeatherResponse } from './types'

/**
 * Query Keys
 */
export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
  full: (lat: number, lon: number) => [...weatherKeys.all, 'full', lat, lon] as const,
}

/**
 * 전체 날씨 데이터 조회 (현재 날씨 + 시간대별 예보)
 * 
 * @param lat 위도
 * @param lon 경도
 * @param options 추가 옵션
 * @returns WeatherData와 쿼리 상태
 */
export const useWeatherData = (
  lat: number | null,
  lon: number | null,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
): UseQueryResult<WeatherData, Error> => {
  return useQuery({
    queryKey: weatherKeys.full(lat ?? 0, lon ?? 0),
    queryFn: async () => {
      if (lat === null || lon === null) {
        throw new Error('위도와 경도가 필요합니다.')
      }
      
      if (!isApiKeyValid()) {
        throw new Error('날씨 API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.')
      }
      
      return fetchWeatherData(lat, lon)
    },
    enabled: lat !== null && lon !== null && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 1000 * 60 * 5, // 기본 5분
    refetchInterval: options?.refetchInterval, // 자동 갱신 간격 (선택사항)
    retry: 2,
  })
}

/**
 * 현재 날씨만 조회 (간단한 정보만 필요할 때)
 * 
 * @param lat 위도
 * @param lon 경도
 * @returns CurrentWeatherResponse와 쿼리 상태
 */
export const useCurrentWeather = (
  lat: number | null,
  lon: number | null,
  options?: {
    enabled?: boolean
  }
): UseQueryResult<CurrentWeatherResponse, Error> => {
  return useQuery({
    queryKey: weatherKeys.current(lat ?? 0, lon ?? 0),
    queryFn: async () => {
      if (lat === null || lon === null) {
        throw new Error('위도와 경도가 필요합니다.')
      }
      
      if (!isApiKeyValid()) {
        throw new Error('날씨 API 키가 설정되지 않았습니다.')
      }
      
      return fetchCurrentWeather(lat, lon)
    },
    enabled: lat !== null && lon !== null && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 3, // 3분
    retry: 2,
  })
}

/**
 * 여러 위치의 날씨를 동시에 조회
 * (즐겨찾기 카드들에 사용)
 * 
 * @param locations 위치 목록 [{lat, lon}, ...]
 * @returns 각 위치의 날씨 쿼리 결과 배열
 */
export const useMultipleWeatherData = (
  locations: Array<{ lat: number; lon: number }>
) => {
  return useQueries({
    queries: locations.map((location) => ({
      queryKey: weatherKeys.full(location.lat, location.lon),
      queryFn: async () => {
        if (!isApiKeyValid()) {
          throw new Error('날씨 API 키가 설정되지 않았습니다.')
        }
        return fetchWeatherData(location.lat, location.lon)
      },
      staleTime: 1000 * 60 * 5,
      retry: 2,
    })),
  })
}