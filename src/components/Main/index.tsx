import { useSelector } from 'react-redux'

import { RootState } from '../../store'
import { setBgColor } from '../../utils/setBgColor'
import HeaderSearch from '../HeaderSearch'

const Main = () => {
  const { weatherCode } = useSelector((state: RootState) => state.day)
  const bgColor = setBgColor(weatherCode)

  return (
    <main
      className={`relative h-dvh p-4 pr-[216px] backdrop-brightness-90 transition-colors duration-200 after:absolute after:inset-0 after:-z-10 after:backdrop-brightness-110 after:content-[''] ${bgColor} `}
    >
      <HeaderSearch />
    </main>
  )
}

export default Main
