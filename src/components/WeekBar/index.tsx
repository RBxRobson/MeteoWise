import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useGetWeeklyForecastQuery } from '../../services/api'
import { RootState } from '../../store'
import { setDay } from '../../store/reducers/day'
import { DailyForecast } from '../../types/api-response'
import { setBgColor } from '../../utils/setBgColor'
import { setWeatherIcon } from '../../utils/setWeatherIcon'
import { getWeatherDescription } from '../../utils/weatherCodes'

const WeekBar = () => {
  const dispatch = useDispatch()

  const { coordinates } = useSelector((state: RootState) => state.city)
  const { date: selectedDate, weatherCode } = useSelector((state: RootState) => state.day)

  const { data, error, isLoading } = useGetWeeklyForecastQuery({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  })

  const handleSelectDay = useCallback(
    (date: string, weatherCode: number) => {
      dispatch(setDay({ date, weatherCode }))
    },
    [dispatch],
  )

  const dailyForecasts: DailyForecast[] = useMemo(() => {
    if (!data) return []
    return data.daily.time.map((date, index) => ({
      date,
      temperature_min: Math.round(data.daily.temperature_2m_min[index]),
      temperature_max: Math.round(data.daily.temperature_2m_max[index]),
      weather_code: data.daily.weathercode[index],
    }))
  }, [data])

  if (isLoading) return <p className="px-4 py-2">Carregando...</p>
  if (error) return <p className="px-4 py-2 text-red-500">Erro ao carregar os dados.</p>

  const bgColor = setBgColor(weatherCode)

  return (
    <div className="fixed top-0 right-0 h-screen w-54 overflow-x-hidden overflow-y-auto">
      <ul
        className={`float-right flex h-full w-48 flex-col py-2 transition duration-200 ${bgColor}`}
      >
        {dailyForecasts.map((forecast) => {
          const isActive = selectedDate === forecast.date
          return (
            <li
              key={forecast.date}
              onClick={() => handleSelectDay(forecast.date, forecast.weather_code)}
              className={`cursor-pointer border-t border-t-gray-300/30 px-2 py-4 transition-all duration-200 ${isActive ? 'relative z-[1] -translate-y-1 scale-[1.06] rounded-l-lg shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : ''} ${bgColor} first:border-t-0`}
              role="button"
              tabIndex={0}
            >
              <time dateTime={forecast.date} className="font-playfair flex flex-col items-center">
                <h3 className="text-2xl/5 font-bold">
                  {format(parseISO(forecast.date), 'EEEE', { locale: ptBR })
                    .slice(0, 3)
                    .replace(/^./, (char) => char.toUpperCase())}
                </h3>
                <h3 className="text-txmuted font-bold">
                  {format(parseISO(forecast.date), 'd MMM', { locale: ptBR }).replace(
                    /\b[a-z]/,
                    (char) => char.toUpperCase(),
                  )}
                </h3>
              </time>
              <div className="mt-1 flex items-center justify-center">
                <div className="flex w-1/2 items-center justify-center">
                  <img
                    src={setWeatherIcon(forecast.weather_code)}
                    alt={getWeatherDescription(forecast.weather_code)}
                    title={getWeatherDescription(forecast.weather_code)}
                    className="w-full max-w-[70px]"
                  />
                </div>
                <div className="font-oswald flex w-1/2 flex-col text-center text-2xl/6">
                  <span>{forecast.temperature_max}°</span>
                  <span>{forecast.temperature_min}°</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default WeekBar
