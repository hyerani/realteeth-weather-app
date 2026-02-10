export const ENV = {
  WEATHER_API_KEY: import.meta.env.VITE_WEATHER_API_KEY,
  WEATHER_API_BASE_URL: import.meta.env.VITE_WEATHER_API_BASE_URL,
} as const

if (!ENV.WEATHER_API_KEY) {
  throw new Error('VITE_WEATHER_API_KEY 에러')
}