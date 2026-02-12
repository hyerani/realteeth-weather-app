/**
 * 좌표 정보
 */
export interface Coordinates {
  lat: number
  lon: number
}

/**
 * 날씨 상태 정보
 */
export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

/**
 * 현재 날씨 API 응답
 */
export interface CurrentWeatherResponse {
  coord: Coordinates
  weather: WeatherCondition[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  rain?: {
    '1h'?: number
    '3h'?: number
  }
  snow?: {
    '1h'?: number
    '3h'?: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

/**
 * 시간대별 예보 API 응답
 */
export interface HourlyForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
    temp_kf?: number
  }
  weather: WeatherCondition[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  rain?: {
    '3h'?: number
  }
  snow?: {
    '3h'?: number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}

export interface HourlyForecastResponse {
  cod: string
  message: number
  cnt: number
  list: HourlyForecastItem[]
  city: {
    id: number
    name: string
    coord: Coordinates
    country: string
    population?: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

/**
 * 가공된 날씨 데이터
 */
export interface WeatherData {
  location: string
  coordinates: Coordinates
  current: {
    temp: number
    feelsLike: number
    tempMin: number
    tempMax: number
    humidity: number
    description: string
    icon: string
    sunrise: number
    sunset: number
  }
  hourly: HourlyWeather[]
  timestamp: number
}

/**
 * 시간대별 날씨 정보
 */
export interface HourlyWeather {
  time: number
  timeText: string
  temp: number
  description: string
  icon: string
  pop?: number
}