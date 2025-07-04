import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { RootState } from '../../store'
import { setDay } from '../../store/reducers/day'
import { DailyForecast, WeeklyForecastResponse } from '../../types/api-response'
import { setBgColor } from '../../utils/setBgColor'
import { setWeatherIcon } from '../../utils/setWeatherIcon'
import { getWeatherDescription } from '../../utils/weatherCodes'

type Props = {
  data: WeeklyForecastResponse
}

const WeekBar = ({ data }: Props) => {
  const dispatch = useDispatch()
  const { date: selectedDate, weatherCode } = useSelector((state: RootState) => state.day)

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

  const bgColor = setBgColor(weatherCode)

  return (
    <div className="scrollbar-hide fixed top-0 right-0 h-screen w-54 overflow-x-hidden overflow-y-auto">
      <ul
        className={`float-right flex h-full w-48 flex-col py-2 transition duration-200 ${bgColor}`}
      >
        {dailyForecasts.map((forecast) => {
          const isActive = selectedDate === forecast.date
          return (
            <li
              key={forecast.date}
              onClick={() => handleSelectDay(forecast.date, forecast.weather_code)}
              className={`border-txmuted/60 cursor-pointer border-t px-2 py-4 transition-all duration-200 ${isActive ? 'relative z-[1] -translate-y-1 scale-[1.06] rounded-l-lg' : ''} ${bgColor} first:border-t-0`}
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
