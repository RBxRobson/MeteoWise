import { useSelector } from 'react-redux'

import { RootState } from '../../store'
import { setBgColor } from '../../utils/setBgColor'
import DailyDetail from '../DailyDetail'
import HeaderSearch from '../HeaderSearch'

const Main = () => {
  const { weatherCode } = useSelector((state: RootState) => state.day)
  const bgColor = setBgColor(weatherCode)

  return (
    <main
      className={`relative min-h-dvh p-4 pr-[216px] backdrop-brightness-90 transition-colors duration-200 after:absolute after:inset-0 after:-z-10 after:backdrop-brightness-[1.03] after:content-[''] ${bgColor} `}
    >
      <div className="mx-auto max-w-7xl">
        <HeaderSearch />
        <DailyDetail />
      </div>
    </main>
  )
}

export default Main
