import type { District, SearchResult, SearchOptions } from '../model/districtTypes'

/**
 * 한국어 초성 추출
 */
const CHOSUNG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

const getChosung = (text: string): string => {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0) - 44032
      if (code > -1 && code < 11172) {
        return CHOSUNG_LIST[Math.floor(code / 588)]
      }
      return char
    })
    .join('')
}

/**
 * 검색어 정규화
 */
const normalizeQuery = (query: string): string => {
  return query.replace(/\s+/g, '').toLowerCase()
}

/**
 * 매칭 점수 계산
 */
const calculateMatchScore = (district: District, query: string): number => {
  const normalizedQuery = normalizeQuery(query)
  const fullName = normalizeQuery(district.fullName)
  const name = normalizeQuery(district.name)
  const chosung = getChosung(district.fullName)

  if (name === normalizedQuery) return 1000
  if (fullName === normalizedQuery) return 900

  if (name.startsWith(normalizedQuery)) return 800
  if (fullName.startsWith(normalizedQuery)) return 700

  if (name.includes(normalizedQuery)) return 600
  if (fullName.includes(normalizedQuery)) return 500

  if (chosung.includes(normalizedQuery)) return 400

  return 0
}

/**
 * 장소 검색 함수
 * 
 * @param districts - 전체 행정구역 데이터
 * @param options - 검색 옵션
 * @returns 검색 결과 배열
 */
export const searchDistricts = (
  districts: District[],
  options: SearchOptions
): SearchResult[] => {
  const { query, limit = 20, level } = options

  if (!query.trim()) {
    return []
  }

  const normalizedQuery = normalizeQuery(query)

  const results = districts
    .map((district) => {
      const score = calculateMatchScore(district, normalizedQuery)

      if (score === 0) return null

      return {
        district,
        matchedText: district.fullName,
        score,
      }
    })
    .filter((result): result is SearchResult => result !== null)

  const filtered = level
    ? results.filter((result) => level.includes(result.district.level))
    : results
  return filtered.sort((a, b) => b.score - a.score).slice(0, limit)
}

/**
 * 검색어 하이라이트 처리
 * 
 * @param text - 원본 텍스트
 * @param query - 검색어
 * @returns 하이라이트 정보 배열
 */
export const highlightText = (
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> => {
  if (!query.trim()) {
    return [{ text, highlight: false }]
  }

  const normalizedQuery = normalizeQuery(query)
  const lowerText = text.toLowerCase()
  const index = lowerText.indexOf(normalizedQuery)

  if (index === -1) {
    return [{ text, highlight: false }]
  }

  return [
    { text: text.slice(0, index), highlight: false },
    { text: text.slice(index, index + query.length), highlight: true },
    { text: text.slice(index + query.length), highlight: false },
  ].filter((part) => part.text.length > 0)
}
