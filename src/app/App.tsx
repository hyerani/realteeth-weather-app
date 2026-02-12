import { QueryProvider, RouterProvider } from './providers'
import './styles/globals.css'

function App() {
  return (
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  )
}

export default App