import { QueryProvider } from './providers/QueryProvider'
import { RouterProvider } from './providers/RouterProvider'
import './styles/globals.css'

function App() {
  return (
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  )
}

export default App