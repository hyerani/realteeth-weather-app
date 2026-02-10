import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getCurrentPosition,
  getCurrentLocation,
  checkGeolocationPermission,
  isGeolocationAvailable,
} from '../api/geolocationApi'


export const locationKeys = {
  all: ['location'] as const,
  current: () => [...locationKeys.all, 'current'] as const,
  permission: () => [...locationKeys.all, 'permission'] as const,
}

/**
 * 현재 위치 좌표 가져오기 훅
 * 
 * @param options 옵션
 * @returns 현재 위치 쿼리 결과
 * 
 * @example
 * ```tsx
 * function CurrentLocationWeather() {
 *   const { data: location, isLoading, error } = useCurrentPosition()
 *   
 *   if (isLoading) return <div>위치 확인 중...</div>
 *   if (error) return <div>위치를 가져올 수 없습니다</div>
 *   
 *   return <CurrentLocationWidget lat={location.coordinates.lat} lon={location.coordinates.lon} />
 * }
 * ```
 */
export const useCurrentPosition = (options?: {
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: locationKeys.current(),
    queryFn: () => getCurrentPosition(),
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

/**
 * 현재 위치와 주소를 함께 가져오기 훅
 * 
 * @param options 옵션
 * @returns 현재 위치 + 주소 쿼리 결과
 * 
 * @example
 * ```tsx
 * function MyLocation() {
 *   const { data, isLoading } = useCurrentLocation()
 *   
 *   if (isLoading) return <div>현재 위치 확인 중...</div>
 *   
 *   return (
 *     <div>
 *       <p>현재 위치: {data.address}</p>
 *       <p>좌표: {data.coordinates.lat}, {data.coordinates.lon}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export const useCurrentLocation = (options?: {
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: locationKeys.current(),
    queryFn: () => getCurrentLocation(),
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

/**
 * 위치 권한 상태 확인 훅
 * 
 * @returns 권한 상태
 * 
 * @example
 * ```tsx
 * function LocationPermissionGuard() {
 *   const { permission, isAvailable, requestPermission } = useGeolocationPermission()
 *   
 *   if (!isAvailable) {
 *     return <div>이 브라우저는 위치 정보를 지원하지 않습니다</div>
 *   }
 *   
 *   if (permission === 'denied') {
 *     return <div>위치 권한이 거부되었습니다. 설정에서 허용해주세요.</div>
 *   }
 *   
 *   if (permission === 'prompt') {
 *     return <button onClick={requestPermission}>위치 권한 요청</button>
 *   }
 *   
 *   return <CurrentLocationWeather />
 * }
 * ```
 */
export const useGeolocationPermission = () => {
  const [permission, setPermission] = useState<PermissionState>('prompt')
  const [isAvailable] = useState(isGeolocationAvailable())

  useEffect(() => {
    if (isAvailable) {
      checkGeolocationPermission().then(setPermission)
    }
  }, [isAvailable])

  const requestPermission = async () => {
    try {
      await getCurrentPosition()
      setPermission('granted')
    } catch (error) {
      console.error('위치 권한 요청 실패', error)
      const newPermission = await checkGeolocationPermission()
      setPermission(newPermission)
    }
  }

  return {
    permission,
    isAvailable,
    requestPermission,
  }
}

/**
 * 현재 위치를 자동으로 가져오고 상태를 관리하는 훅
 * 
 * @returns 위치 상태 및 함수
 * 
 * @example
 * ```tsx
 * function App() {
 *   const {
 *     coordinates,
 *     address,
 *     isLoading,
 *     error,
 *     hasPermission,
 *     requestLocation,
 *   } = useAutoGeolocation()
 *   
 *   if (!hasPermission) {
 *     return (
 *       <div>
 *         <p>날씨 정보를 보려면 위치 권한이 필요합니다</p>
 *         <button onClick={requestLocation}>위치 권한 허용</button>
 *       </div>
 *     )
 *   }
 *   
 *   if (isLoading) return <div>현재 위치 확인 중...</div>
 *   if (error) return <div>위치를 가져올 수 없습니다: {error.message}</div>
 *   
 *   return <WeatherPage lat={coordinates.lat} lon={coordinates.lon} location={address} />
 * }
 * ```
 */
export const useAutoGeolocation = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false)

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useCurrentLocation({
    enabled: shouldFetch,
  })

  useEffect(() => {
    checkGeolocationPermission().then((permission) => {
      if (permission === 'granted') {
        setHasPermission(true)
        setShouldFetch(true)
      }
    })
  }, [])

  const requestLocation = async () => {
    try {
      await getCurrentPosition()
      setHasPermission(true)
      setShouldFetch(true)
      refetch()
    } catch (error) {
      console.error('위치 권한 요청 실패', error)
    }
  }

  return {
    coordinates: data?.coordinates || null,
    address: data?.address || null,
    isLoading,
    error,
    hasPermission,
    requestLocation,
    refetch,
  }
}