import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Favorite, FavoritesState } from './types'
import { MAX_FAVORITES } from './types'

/**
 * 즐겨찾기 Store
 */
export const useFavoriteStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (address: string, displayName?: string) => {
        const { favorites } = get()

        if (favorites.some((fav) => fav.address === address)) {
          throw new Error('이미 즐겨찾기에 추가된 장소입니다.')
        }

        if (favorites.length >= MAX_FAVORITES) {
          throw new Error(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 추가할 수 있습니다.`)
        }
        const newFavorite: Favorite = {
          id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          address,
          displayName: displayName || address,
          addedAt: Date.now(),
        }

        set({ favorites: [...favorites, newFavorite] })
      },

      removeFavorite: (id: string) => {
        const { favorites } = get()
        set({ favorites: favorites.filter((fav) => fav.id !== id) })
      },

      updateDisplayName: (id: string, newName: string) => {
        const { favorites } = get()
        set({
          favorites: favorites.map((fav) =>
            fav.id === id ? { ...fav, displayName: newName } : fav,
          ),
        })
      },

      isFavorite: (address: string) => {
        const { favorites } = get()
        return favorites.some((fav) => fav.address === address)
      },

      getFavoriteByAddress: (address: string) => {
        const { favorites } = get()
        return favorites.find((fav) => fav.address === address)
      },
    }),
    {
      name: 'weather-favorites',
    },
  ),
)
