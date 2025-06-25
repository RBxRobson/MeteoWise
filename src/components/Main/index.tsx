import { useSelector } from 'react-redux'

import { useGetDetailedForecastQuery, useGetWeeklyForecastQuery } from '../../services/api'
import { RootState } from '../../store'
import { setBgColor } from '../../utils/setBgColor'
import DailyDetail from '../DailyDetail'
import HeaderSearch from '../HeaderSearch'
import WeekBar from '../WeekBar'

const Main = () => {
  const { date } = useSelector((state: RootState) => state.day)
  const { weatherCode } = useSelector((state: RootState) => state.day)
  const { coordinates } = useSelector((state: RootState) => state.city)
  const { latitude, longitude } = coordinates
  const bgColor = setBgColor(weatherCode)

  const { data: weekBarData } = useGetWeeklyForecastQuery({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  })

  const { data: dailyDetailData } = useGetDetailedForecastQuery(
    { latitude, longitude, date, isToday: true },
    { skip: !latitude || !longitude || !date },
  )

  if (!dailyDetailData || !weekBarData) return <div></div>

  return (
    <>
      <main
        className={`relative min-h-dvh p-4 pr-[216px] backdrop-brightness-90 transition-colors duration-200 after:absolute after:inset-0 after:-z-10 after:backdrop-brightness-[1.03] after:content-[''] ${bgColor} `}
      >
        <div className="mx-auto max-w-7xl">
          <HeaderSearch />
          <DailyDetail data={dailyDetailData} />
        </div>
      </main>
      <WeekBar data={weekBarData} />
    </>
  )
}

export default Main
