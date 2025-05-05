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

import './styles.css'

const WeekBar = () => {
  const { coordinates } = useSelector((state: RootState) => state.city)
  const { date: dayActiveDate, weatherCode } = useSelector((state: RootState) => state.day)
  const dispatch = useDispatch()

  const setDayActive = (date: string, weatherCode: number) => {
    dispatch(
      setDay({
        date,
        weatherCode,
      }),
    )
  }

  const { data, error, isLoading } = useGetWeeklyForecastQuery({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os dados.</p>

  const dailyForecasts: DailyForecast[] =
    data?.daily.time.map((date, index) => ({
      date,
      temperature_min: Math.round(data.daily.temperature_2m_min[index]),
      temperature_max: Math.round(data.daily.temperature_2m_max[index]),
      weather_code: data.daily.weathercode[index],
    })) || []

  return (
    <div className="nav">
      <ul className={`${setBgColor(weatherCode)} days-list`}>
        {dailyForecasts.map((forecast) => (
          <li
            className={`day ${setBgColor(weatherCode)} ${dayActiveDate === forecast.date ? 'day--active' : ''}`}
            key={forecast.date}
            onClick={() => setDayActive(forecast.date, forecast.weather_code)}
          >
            <time dateTime={forecast.date} className="day-date">
              <h3 className="title">
                {format(parseISO(forecast.date), 'EEEE', { locale: ptBR })
                  .slice(0, 3)
                  .replace(/^./, (char) => char.toUpperCase())}
              </h3>
              <h3 className="subtitle">
                {format(parseISO(forecast.date), 'd MMM', { locale: ptBR }).replace(
                  /\b[a-z]/,
                  (char) => char.toUpperCase(),
                )}
              </h3>
            </time>
            <div className="daytime-weather">
              <div className="icon">
                <img
                  src={setWeatherIcon(forecast.weather_code)}
                  alt={getWeatherDescription(forecast.weather_code)}
                  title={getWeatherDescription(forecast.weather_code)}
                />
              </div>
              <h3 className="title">
                <span>{forecast.temperature_max}°</span>
                <span>{forecast.temperature_min}°</span>
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WeekBar
