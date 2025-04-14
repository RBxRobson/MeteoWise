import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { format } from 'date-fns'

import {
  DetailedForecastResponse,
  GeocodingResponse,
  WeeklyForecastResponse,
} from '../types/api-response'

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.open-meteo.com/v1/',
  }),
  endpoints: (builder) => ({
    getCoordinatesByCity: builder.query<GeocodingResponse, string>({
      query: (city) =>
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`,
    }),

    // Previsão de 7 dias
    getWeeklyForecast: builder.query<
      WeeklyForecastResponse,
      { latitude: number; longitude: number }
    >({
      query: ({ latitude, longitude }) => {
        const today = new Date()
        const startDate = format(today, 'yyyy-MM-dd')
        const endDate = format(new Date(today.setDate(today.getDate() + 6)), 'yyyy-MM-dd')

        return {
          url: `forecast`,
          params: {
            latitude,
            longitude,
            daily: ['temperature_2m_min', 'temperature_2m_max', 'weathercode'].join(','),
            timezone: 'auto',
            start_date: startDate,
            end_date: endDate,
          },
        }
      },
    }),

    // Previsão detalhada de 1 dia
    getDetailedForecast: builder.query<
      DetailedForecastResponse,
      { latitude: number; longitude: number; date: string; isToday: boolean }
    >({
      query: ({ latitude, longitude }) => {
        return {
          url: `forecast`,
          params: {
            latitude,
            longitude,
            daily: [
              'temperature_2m_min',
              'temperature_2m_max',
              'weathercode',
              'precipitation_sum',
            ].join(','),
            hourly: ['relativehumidity_2m', 'precipitation_probability', 'windspeed_10m'].join(','),
            current_weather: true,
            timezone: 'auto',
          },
        }
      },
    }),
  }),
})

export default weatherApi

export const { useGetWeeklyForecastQuery, useGetDetailedForecastQuery } = weatherApi
