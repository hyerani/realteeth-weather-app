import type { Coordinates } from '@/entities/location'

export type { Coordinates }

/**
 * 날씨 상태 정보
 */
export interface WeatherCondition {
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
  current: {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    humidity: number
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
  weather: WeatherCondition[]
  pop: number
}

/**
 * One Call 일별 예보 아이템
 */
export interface OneCallDailyItem {
  temp: {
    min: number
    max: number
  }
  pop: number
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
    pop: number
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
  pop: number
}