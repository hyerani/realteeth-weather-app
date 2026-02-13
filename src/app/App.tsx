import { ErrorBoundary, QueryProvider, RouterProvider } from './providers'
import './styles/globals.css'

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App