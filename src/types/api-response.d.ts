export interface DailyForecast {
  date: string // YYYY-MM-DD
  temperature_min: number
  temperature_max: number
  weather_code: number // Código do tempo (sol, chuva, etc.)
}

export interface WeeklyForecastResponse {
  daily: {
    time: string[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    weathercode: number[]
  }
}

export interface HourlyRainChance {
  time: string // HH:MM
  precipitation_probability: number // 0 a 100%
}

export interface DetailedDayForecast {
  date: string
  temperature_min: number
  temperature_max: number
  precipitation_sum: number
  current_temperature?: number // Só se for o dia atual
  weather_code: number
  humidity: number
  wind_speed_kmh: number
  hourly_rain_chance: HourlyRainChance[] // De 08:00 a 23:00
}

export interface DetailedForecastResponse {
  current_weather?: {
    temperature: number
    windspeed: number
  }
  hourly: {
    time: string[]
    relativehumidity_2m: number[]
    precipitation_probability: number[]
    windspeed_10m: number[]
  }
  daily: {
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    weathercode: number[]
    precipitation_sum: number[]
  }
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  feature_code?: string
  country_code: string
  admin1_id?: number
  admin2_id?: number
  timezone?: string
  population?: number
  country: string
  admin1?: string
  admin2?: string
}

export interface GeocodingResponse {
  results: GeocodingResult[]
}
