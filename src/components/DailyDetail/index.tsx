import { useSelector } from 'react-redux'
import { isToday, parseISO } from 'date-fns'

import { useGetDetailedForecastQuery } from '../../services/api'
import { RootState } from '../../store'
import { calculateDailyAverages } from '../../utils/calculateDailyAverages'
import { formatCapitalizedDate } from '../../utils/formatCapitalizedDate'
import { setWeatherIcon } from '../../utils/setWeatherIcon'
import { getWeatherDescription } from '../../utils/weatherCodes'
import Infographic from '../Infographic'

const DailyDetail = () => {
  const { date } = useSelector((state: RootState) => state.day)
  const { coordinates } = useSelector((state: RootState) => state.city)
  const { latitude, longitude } = coordinates

  const { data, isLoading, isError } = useGetDetailedForecastQuery(
    { latitude, longitude, date, isToday: true },
    { skip: !latitude || !longitude || !date },
  )

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-10 text-center text-sm">
        Carregando previsão detalhada...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="py-10 text-center text-red-500">
        Não foi possível carregar os dados meteorológicos.
      </div>
    )
  }

  const { humidity, wind } = calculateDailyAverages(data)
  const isCurrentDay = isToday(parseISO(date))
  const currentTemp = data.current_weather?.temperature
  const minTemp = Math.round(data.daily.temperature_2m_min[0])
  const maxTemp = Math.round(data.daily.temperature_2m_max[0])

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      {/* Título do dia */}
      <h1 className="font-playfair text-center text-3xl font-semibold drop-shadow">
        {formatCapitalizedDate(date)}
      </h1>

      {/* Highlights */}
      <div className="grid grid-cols-2">
        <ul className="rounded-lg bg-white/10 p-4 px-5">
          <h2 className="text-center">Detalhes do dia</h2>
          <li className="border-txmuted flex items-center border-b py-2">
            <div className="flex w-full justify-between gap-1">
              <p className="text-txmuted">Chance de Precipitação:</p>
              <p>{`${data.daily.precipitation_probability_max}%`}</p>
            </div>
          </li>
          <li className="border-txmuted flex items-center border-b py-2">
            <div className="flex w-full justify-between gap-1">
              <p className="text-txmuted">Umidade média:</p>
              <p>{humidity}</p>
            </div>
          </li>
          <li className="border-txmuted flex items-center border-b py-2">
            <div className="flex w-full justify-between gap-1">
              <p className="text-txmuted">Velocidade do vento:</p>
              <p>{wind}</p>
            </div>
          </li>
          <li className="border-txmuted flex items-center border-b py-2">
            <div className="flex w-full justify-between gap-1">
              <p className="text-txmuted">Quantidade de chuva:</p>
              <p>{`${data.daily.precipitation_sum[0]} mm`}</p>
            </div>
          </li>
        </ul>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <img
            src={setWeatherIcon(data.daily.weathercode[0])}
            alt={getWeatherDescription(data.daily.weathercode[0])}
            title={getWeatherDescription(data.daily.weathercode[0])}
            className="w-28 sm:w-36"
          />
          <div>
            {isCurrentDay ? (
              <p className="text-5xl font-bold">
                {currentTemp !== undefined ? `${currentTemp}°C` : '--°C'}
              </p>
            ) : (
              <p className="text-5xl font-semibold">
                {maxTemp}°/ {minTemp}°
              </p>
            )}
            <p className="text-txmuted text-sm">
              {getWeatherDescription(data.daily.weathercode[0])}
            </p>
          </div>
        </div>
      </div>

      {/* Hourly precipitation */}
      <Infographic data={data} />
    </section>
  )
}

export default DailyDetail
