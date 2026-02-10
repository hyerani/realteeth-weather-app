import { GEOLOCATION_ERROR_MESSAGES, GeolocationErrorCode, type Coordinates, type GeolocationOptions, type GeolocationResult } from "../model/types"


/**
 * 브라우저의 Geolocation API를 사용하여 현재 위치 가져오기
 * 
 * @param options Geolocation 옵션
 * @returns Promise<GeolocationResult>
 * 
 * @example
 * ```ts
 * try {
 *   const position = await getCurrentPosition()
 *   console.log(position.coordinates) // { lat: 37.5665, lon: 126.9780 }
 * } catch (error) {
 *   console.error('위치 가져오기 실패:', error.message)
 * }
 * ```
 */
export const getCurrentPosition = (
  options?: GeolocationOptions
): Promise<GeolocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'))
      return
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 10000,
      maximumAge: options?.maximumAge ?? 0,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        const errorMessage =
          GEOLOCATION_ERROR_MESSAGES[error.code as GeolocationErrorCode] ||
          '위치 정보를 가져올 수 없습니다.'
        reject(new Error(errorMessage))
      },
      defaultOptions
    )
  })
}

/**
 * 위치 권한 상태 확인
 * 
 * @returns Promise<PermissionState> - 'granted', 'denied', 'prompt'
 * 
 * @example
 * ```ts
 * const permission = await checkGeolocationPermission()
 * if (permission === 'granted') {
 *   // 위치 정보 가져오기
 * } else if (permission === 'denied') {
 *   // 권한 거부 안내
 * 
 * ```
 */
export const checkGeolocationPermission = async (): Promise<PermissionState> => {
  if (!navigator.permissions) {
    return 'prompt'
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state
  } catch (error) {
    console.warn('권한 확인 실패:', error)
    return 'prompt'
  }
}

/**
 * 위치 정보가 사용 가능한지 확인
 * 
 * @returns boolean
 */
export const isGeolocationAvailable = (): boolean => {
  return 'geolocation' in navigator
}

/**
 * OpenWeatherMap Geocoding API를 사용한 역지오코딩
 * (좌표 → 주소 변환)
 * 
 * @param lat 위도
 * @param lon 경도
 * @returns Promise<string> 주소
 * 
 * @example
 * ```ts
 * const address = await reverseGeocode(37.5665, 126.9780)
 * console.log(address) // "Seoul"
 * ```
 */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string> => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다.')
  }

  try {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('역지오코딩 요청 실패')
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return '알 수 없는 위치'
    }

    const location = data[0]
    return location.local_names?.ko || location.name || '알 수 없는 위치'
  } catch (error) {
    console.error(error)
    return '위치 정보 없음'
  }
}

/**
 * 현재 위치와 주소를 함께 가져오기
 * 
 * @returns Promise<{ coordinates: Coordinates; address: string }>
 * 
 * @example
 * ```ts
 * const location = await getCurrentLocation()
 * console.log(location.coordinates) // { lat: 37.5665, lon: 126.9780 }
 * console.log(location.address) // "서울"
 * ```
 */
export const getCurrentLocation = async (): Promise<{
  coordinates: Coordinates
  address: string
}> => {
  try {
    const position = await getCurrentPosition()

    const address = await reverseGeocode(
      position.coordinates.lat,
      position.coordinates.lon
    )

    return {
      coordinates: position.coordinates,
      address,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('현재 위치를 가져올 수 없습니다.')
  }
}