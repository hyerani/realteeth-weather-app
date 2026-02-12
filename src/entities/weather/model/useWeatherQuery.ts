import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { fetchWeatherData, fetchWeatherByAddress, isApiKeyValid } from '../api/weatherApi'
import type { WeatherData } from './types'

/**
 * Query Keys
 */
export const weatherKeys = {
  all: ['weather'] as const,
  full: (lat: number, lon: number) => [...weatherKeys.all, 'full', lat, lon] as const,
  byAddress: (address: string) => [...weatherKeys.all, 'byAddress', address] as const,
}

/**
 * 주소로 날씨 데이터 조회
 * 
 * @param address
 * @param options
 * @returns WeatherData와 쿼리 상태
 */
export const useWeatherByAddress = (
  address: string | null,
  options?: {
    enabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }
): UseQueryResult<WeatherData, Error> => {
  return useQuery({
    queryKey: weatherKeys.byAddress(address ?? ''),
    queryFn: async () => {
      if (!address) {
        throw new Error('주소가 필요합니다.')
      }
      
      if (!isApiKeyValid()) {
        throw new Error('날씨 API 키가 설정되지 않았습니다.')
      }
      
      return fetchWeatherByAddress(address)
    },
    enabled: Boolean(address) && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    refetchInterval: options?.refetchInterval,
    retry: 2,
  })
}


/**
 * 전체 날씨 데이터 조회
 * 
 * @param lat
 * @param lon
 * @param options
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
        throw new Error('날씨 API 키가 설정되지 않았습니다.')
      }
      
      return fetchWeatherData(lat, lon)
    },
    enabled: lat !== null && lon !== null && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 1000 * 60 * 5,
    refetchInterval: options?.refetchInterval,
    retry: 2,
  })
}