// API
export {
  fetchCurrentWeather,
  fetchHourlyForecast,
  fetchWeatherData,
  fetchWeatherByAddress,
  getWeatherIconUrl,
  isApiKeyValid,
} from './api/weatherApi'

// Types
export type {
  Coordinates,
  WeatherCondition,
  CurrentWeatherResponse,
  HourlyForecastResponse,
  HourlyForecastItem,
  WeatherData,
  HourlyWeather,
  WeatherApiError,
  WeatherApiParams,
} from './model/types'

// Hooks
export {
  useWeatherData,
  useCurrentWeather,
  useMultipleWeatherData,
  weatherKeys,
} from './model/useWeatherQuery'