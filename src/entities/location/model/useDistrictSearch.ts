import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import districtsData from '@/data/korea_districts.json'
import { searchDistricts } from '../lib/searchDistricts'
import type { District } from './districtTypes'

/**
 * Query Keys
 */
export const districtKeys = {
  all: ['districts'] as const,
  list: () => [...districtKeys.all, 'list'] as const,
  search: (query: string) => [...districtKeys.all, 'search', query] as const,
}

/**
 * 전체 행정구역 데이터 조회
 * 
 * @returns 전체 행정구역 목록
 */
export const useDistricts = () => {
  return useQuery({
    queryKey: districtKeys.list(),
    queryFn: async () => {
      return districtsData as District[]
    },
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

/**
 * 장소 검색 훅
 * 
 * @param query - 검색어
 * @param options - 검색 옵션
 * @returns 검색 결과
 */
export const useDistrictSearch = (
  query: string,
  options?: {
    limit?: number
    enabled?: boolean
  }
) => {
  const { data: districts } = useDistricts()

  const searchResults = useMemo(() => {
    if (!districts || !query.trim()) {
      return []
    }

    return searchDistricts(districts, {
      query,
      limit: options?.limit ?? 20,
    })
  }, [districts, query, options?.limit])

  return {
    data: searchResults,
    isLoading: false,
    districts: districts ?? [],
  }
}