import type { Coordinates } from '@/entities/location'

export type { Coordinates }

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
 * One Call API 응답
 */
export interface OneCallResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust?: number
    weather: WeatherCondition[]
  }
  hourly: OneCallHourlyItem[]
  daily: OneCallDailyItem[]
}

/**
 * One Call 시간대별 예보 아이템
 */
export interface OneCallHourlyItem {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust?: number
  weather: WeatherCondition[]
  pop: number
  rain?: { '1h'?: number }
  snow?: { '1h'?: number }
}

/**
 * One Call 일별 예보 아이템
 */
export interface OneCallDailyItem {
  dt: number
  sunrise: number
  sunset: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  weather: WeatherCondition[]
  clouds: number
  pop: number
  rain?: number
  snow?: number
  uvi: number
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