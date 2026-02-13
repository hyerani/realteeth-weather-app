import { createBrowserRouter, RouterProvider as RRDProvider } from 'react-router-dom'
import { MainPage } from '@/pages/main'
import { WeatherDetailPage } from '@/pages/weather-detail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/weather/:locationId',
    element: <WeatherDetailPage />,
  },
])

export const RouterProvider = () => {
  return <RRDProvider router={router} />
}
