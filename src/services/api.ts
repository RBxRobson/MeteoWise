/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { format } from 'date-fns'

import { setDay } from '../store/reducers/day'
import {
  DetailedForecastResponse,
  GeocodingResponse,
  WeeklyForecastResponse,
} from '../types/api-response'
import { isValidCity } from '../utils/isValidCity'

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.open-meteo.com/v1/',
  }),
  endpoints: (builder) => ({
    getCoordinatesByCity: builder.query<GeocodingResponse, string>({
      query: (city) =>
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`,
      transformResponse: (response: any) => {
        const result = response.results?.[0]

        if (!result || !isValidCity(result)) {
          alert('Desculpe, não temos cobertura na cidade solicitada.')
          return null // Retorna null para evitar que o erro quebre o fluxo
        }

        return response
      },
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const today = new Date()
          const startDate = format(today, 'yyyy-MM-dd')
          const todayIndex = data.daily.time.findIndex((date) => date === startDate)

          if (todayIndex !== -1) {
            const weatherCode = data.daily.weathercode[todayIndex]
            dispatch(setDay({ date: startDate, weatherCode }))
          }
        } catch (error) {
          console.error('Erro ao despachar o dia inicial:', error)
        }
      },
    }),

    // Previsão detalhada de 1 dia
    getDetailedForecast: builder.query<
      DetailedForecastResponse,
      { latitude: number; longitude: number; date: string; isToday: boolean }
    >({
      query: ({ latitude, longitude, date }) => {
        return {
          url: `forecast`,
          params: {
            latitude,
            longitude,
            daily: [
              'temperature_2m_min',
              'temperature_2m_max',
              'precipitation_probability_max',
              'weathercode',
              'precipitation_sum',
            ].join(','),
            hourly: [
              'relativehumidity_2m',
              'precipitation_probability',
              'windspeed_10m',
              'precipitation',
            ].join(','),
            current_weather: true,
            timezone: 'auto',
            start_date: date,
            end_date: date,
          },
        }
      },
    }),
  }),
})

export default weatherApi

export const {
  useGetWeeklyForecastQuery,
  useGetDetailedForecastQuery,
  useGetCoordinatesByCityQuery,
} = weatherApi
