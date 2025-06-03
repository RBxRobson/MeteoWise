import { DetailedForecastResponse } from '../types/api-response'

export function calculateDailyAverages(data: DetailedForecastResponse) {
  const humidityValues = data.hourly.relativehumidity_2m
  const windValues = data.hourly.windspeed_10m

  const avgHumidity =
    humidityValues.reduce((acc: number, cur: number) => acc + cur, 0) / humidityValues.length
  const avgWind = windValues.reduce((acc: number, cur: number) => acc + cur, 0) / windValues.length

  return {
    humidity: `${avgHumidity.toFixed(1)}%`,
    wind: `${avgWind.toFixed(1)} km/h`,
  }
}
