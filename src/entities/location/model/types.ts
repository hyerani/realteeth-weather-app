/**
 * 위치 관련 타입 정의
 */

/**
 * 좌표 정보
 */
export interface Coordinates {
  lat: number
  lon: number
}

/**
 * Geolocation API 에러 코드
 */
export const GeolocationErrorCode = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const

export type GeolocationErrorCode = (typeof GeolocationErrorCode)[keyof typeof GeolocationErrorCode]

/**
 * Geolocation API 에러 메시지
 */
export const GEOLOCATION_ERROR_MESSAGES = {
  [GeolocationErrorCode.PERMISSION_DENIED]: '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
  [GeolocationErrorCode.POSITION_UNAVAILABLE]: '위치 정보를 사용할 수 없습니다.',
  [GeolocationErrorCode.TIMEOUT]: '위치 정보를 가져오는 시간이 초과되었습니다.',
} as const

/**
 * 위치 감지 옵션
 */
export interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

/**
 * 위치 감지 결과
 */
export interface GeolocationResult {
  coordinates: Coordinates
  timestamp: number
  accuracy: number
}
