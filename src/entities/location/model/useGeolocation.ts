import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getCurrentPosition,
  getCurrentLocation,
  checkGeolocationPermission,
} from '../api/geolocationApi'


export const locationKeys = {
  all: ['location'] as const,
  current: () => [...locationKeys.all, 'current'] as const,
}

/**
 * 현재 위치와 주소를 함께 가져오기 훅
 * 
 * @param options
 * @returns 현재 위치 + 주소 쿼리 결과
 */
const useCurrentLocation = (options?: {
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
 * 현재 위치를 자동으로 가져오고 상태를 관리하는 훅
 * 
 * @returns 위치 상태 및 함수
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