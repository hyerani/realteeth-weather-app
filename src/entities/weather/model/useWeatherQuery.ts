import { useQuery, useQueries, type UseQueryResult } from '@tanstack/react-query'
import { fetchWeatherData, fetchCurrentWeather, fetchWeatherByAddress, isApiKeyValid } from '../api/weatherApi'
import type { WeatherData, CurrentWeatherResponse } from './types'

/**
 * Query Keys
 */
export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
  full: (lat: number, lon: number) => [...weatherKeys.all, 'full', lat, lon] as const,
  byAddress: (address: string) => [...weatherKeys.all, 'byAddress', address] as const,
}

/**
 * 주소로 날씨 데이터 조회
 * 
 * @param address - 주소
 * @param options - 추가 옵션
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

/**
 * 현재 날씨만 조회
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
    staleTime: 1000 * 60 * 3,
    retry: 2,
  })
}

/**
 * 여러 도시의 날씨를 동시에 조회
 * 
 * @param addresses 도시 이름 목록
 * @returns 각 도시의 날씨 쿼리 결과 배열
 */
export const useMultipleWeatherByName = (
  addresses: string[]
) => {
  return useQueries({
    queries: addresses.map((address) => ({
      queryKey: weatherKeys.byAddress(address),
      queryFn: async () => {
        if (!isApiKeyValid()) {
          throw new Error('날씨 API 키가 설정되지 않았습니다.')
        }
        return fetchWeatherByAddress(address)
      },
      staleTime: 1000 * 60 * 5,
      retry: 2,
    })),
  })
}

/**
 * 여러 위치의 날씨를 동시에 조회
 * 
 * @param locations 위치 목록
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