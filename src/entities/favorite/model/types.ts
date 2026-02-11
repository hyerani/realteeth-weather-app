/**
 * 즐겨찾기 관련 타입 정의
 */

/**
 * 즐겨찾기 항목
 */
export interface Favorite {
  id: string
  address: string
  displayName: string
  addedAt: number
}

/**
 * 즐겨찾기 상태
 */
export interface FavoritesState {
  favorites: Favorite[]
  addFavorite: (address: string, displayName?: string) => void
  removeFavorite: (id: string) => void
  updateDisplayName: (id: string, newName: string) => void
  isFavorite: (address: string) => boolean
  getFavoriteByAddress: (address: string) => Favorite | undefined
}

/**
 * 즐겨찾기 최대 개수
 */
export const MAX_FAVORITES = 6