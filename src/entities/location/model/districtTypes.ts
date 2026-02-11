/**
 * 주소 데이터 타입
 */

/**
 * 행정구역 레벨
 */
export type DistrictLevel = 'sido' | 'sigungu' | 'eupmyeondong'

/**
 * 행정구역 정보
 */
export interface District {
  id: string
  name: string
  fullName: string
  level: DistrictLevel
  sido: string
  sigungu?: string
  eupmyeondong?: string
}

/**
 * 검색 결과
 */
export interface SearchResult {
  district: District
  matchedText: string
  score: number
}

/**
 * 장소 검색 옵션
 */
export interface SearchOptions {
  query: string
  limit?: number
  level?: DistrictLevel[]
}