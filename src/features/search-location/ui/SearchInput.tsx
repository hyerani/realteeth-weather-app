import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/shared'


interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  autoFocus?: boolean
}

/**
 * 장소 검색 입력 컴포넌트
 */
export const SearchInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = '장소를 검색하세요 (예: 서울, 강남구, 삼성동)',
  autoFocus = false,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3",
        "bg-white border-2 rounded-lg transition-all",
        isFocused ? "border-blue-500 shadow-lg" : "border-gray-200",
      )}
    >
      <Search
        className={cn(
          "w-5 h-5 transition-colors",
          isFocused ? "text-blue-500" : "text-gray-400",
        )}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="flex-1 outline-none text-gray-900 placeholder:text-gray-400"
      />

      {value && (
        <button
          onClick={handleClear}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  )
}