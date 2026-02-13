import { Star } from 'lucide-react'
import { useFavoriteToggle } from '@/entities/favorite'
import { cn } from '@/shared'

interface AddFavoriteButtonProps {
  address: string
  onSuccess?: () => void
  size?: 'default' | 'sm'
}

/**
 * 즐겨찾기 추가/삭제 버튼
 */
export const AddFavoriteButton = ({
  address,
  onSuccess,
  size = 'default',
}: AddFavoriteButtonProps) => {
  const { isAdded, isLoading, error, toggle } = useFavoriteToggle(address)

  const isSmall = size === 'sm'

  return (
    <div className="relative">
      <button
        onClick={() => toggle(onSuccess)}
        disabled={isLoading}
        className={cn(
          'flex items-center rounded-lg font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isSmall ? 'gap-1 p-1.5 md:gap-1.5 md:px-3 md:py-1.5' : 'gap-2 px-4 py-2',
          isAdded
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        )}
      >
        <Star
          className={cn(
            isSmall ? 'w-6 h-6 md:w-[18px] md:h-[18px]' : 'w-5 h-5',
            isAdded ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400',
          )}
        />
        <span className={cn(isSmall && 'hidden md:inline text-sm')}>
          {isAdded ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
        </span>
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  )
}
