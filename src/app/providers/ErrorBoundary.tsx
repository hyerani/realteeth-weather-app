import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert, RotateCcw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <TriangleAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">문제가 발생했습니다</h1>
            <p className="text-sm text-gray-500 mb-6">
              예상치 못한 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해주세요.
            </p>
            {this.state.error && (
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 mb-6 break-words">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                다시 시도
              </button>
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
