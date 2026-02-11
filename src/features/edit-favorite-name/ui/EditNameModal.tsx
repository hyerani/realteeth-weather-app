import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useFavoriteStore } from '@/entities/favorite'

interface EditNameModalProps {
  favoriteId: string
  currentName: string
  isOpen: boolean
  onClose: () => void
}

/**
 * 즐겨찾기 별칭 수정 모달
 */
export const EditNameModal = ({
  favoriteId,
  currentName,
  isOpen,
  onClose,
}: EditNameModalProps) => {
  const { updateDisplayName } = useFavoriteStore()
  const [newName, setNewName] = useState(currentName)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newName.trim()) {
      return
    }

    updateDisplayName(favoriteId, newName.trim())
    onClose()
  }

  const handleCancel = () => {
    setNewName(currentName)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">별칭 수정</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 별칭
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예: 우리집, 회사"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                       focus:border-blue-500 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              {newName.length}/20자
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg
                       font-medium hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!newName.trim() || newName === currentName}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg
                       font-medium hover:bg-blue-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}