import { ENV } from "@/shared"
import { GEOLOCATION_ERROR_MESSAGES, GeolocationErrorCode, type Coordinates, type GeolocationOptions } from "../model/types"

const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0'

/**
 * Geocoding API URL 생성
 */
const buildGeoUrl = (endpoint: string, params: Record<string, string | number>): string => {
  const url = new URL(`${GEO_BASE_URL}/${endpoint}`)

  url.searchParams.append('appid', ENV.WEATHER_API_KEY)
  url.searchParams.append('limit', '1')

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value))
  })

  return url.toString()
}

/**
 * 브라우저의 Geolocation API를 사용하여 현재 위치 가져오기
 *
 * @param options Geolocation 옵션
 * @returns Promise<Coordinates>
 */
export const getCurrentPosition = (
  options?: GeolocationOptions
): Promise<Coordinates> => {
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
          lat: position.coords.latitude,
          lon: position.coords.longitude,
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
 * OpenWeatherMap Geocoding API를 사용한 역지오코딩
 * (좌표 → 주소 변환)
 *
 * @param lat
 * @param lon
 * @returns Promise<string> 주소
 */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string> => {
  try {
    const url = buildGeoUrl('reverse', { lat, lon })
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
 * 주소 정규화 (도/시 이름 축약)
 */
const normalizeAddress = (address: string): string => {
  let normalized = address

  normalized = normalized.replace(/특별자치도/g, '도')
  normalized = normalized.replace(/특별자치시/g, '시')

  return normalized
}

/**
 * OpenWeatherMap Geocoding API를 사용한 정지오코딩
 * (주소 → 좌표 변환)
 *
 * @param address
 * @returns Promise<Coordinates> 좌표
 */
export const geocodeAddress = async (
  address: string
): Promise<Coordinates> => {
  const fetchCoords = async (query: string): Promise<Coordinates | null> => {
    try {
      const url = buildGeoUrl('direct', { q: `${query},KR` })
      const response = await fetch(url)

      if (!response.ok) return null

      const data = await response.json()

      if (!data || data.length === 0) return null

      return {
        lat: data[0].lat,
        lon: data[0].lon,
      }
    } catch {
      return null
    }
  }

  try {
    let coords = await fetchCoords(address)

    if (!coords) {
      const normalized = normalizeAddress(address)
      if (normalized !== address) {
        coords = await fetchCoords(normalized)
      }
    }

    if (!coords && address.includes(' ')) {
      const segments = address.split(' ').filter(s => s.trim().length > 0)
      if (segments.length > 1) {
        const lastSegment = segments[segments.length - 1]
        coords = await fetchCoords(lastSegment)
      }
    }

    if (!coords) {
      throw new Error('해당 주소를 찾을 수 없습니다.')
    }

    return coords
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('좌표 변환에 실패했습니다.')
  }
}

/**
 * 현재 위치와 주소를 함께 가져오기
 *
 * @returns Promise<{ coordinates: Coordinates; address: string }>
 */
export const getCurrentLocation = async (): Promise<{
  coordinates: Coordinates
  address: string
}> => {
  try {
    const coordinates = await getCurrentPosition()

    const address = await reverseGeocode(coordinates.lat, coordinates.lon)

    return { coordinates, address }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('현재 위치를 가져올 수 없습니다.')
  }
}