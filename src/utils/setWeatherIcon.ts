import ClearDayIcon from '../assets/svgs/animated/clear-day.svg'
import CloudIcon from '../assets/svgs/animated/cloudy.svg'
import PartialCloudIcon from '../assets/svgs/animated/cloudy-2-day.svg'
import RainyIcon from '../assets/svgs/animated/rainy-2.svg'
import SnowIcon from '../assets/svgs/animated/snowy-2.svg'
import StormIcon from '../assets/svgs/animated/thunderstorms.svg'
import { cloudCodes, partialCloudCode, rainyCodes, snowCodes, stormCodes } from './weatherCodes'

// Função para definir a cor de fundo de acordo com o clima
export const setWeatherIcon = (weatherCode: number | undefined) => {
  if (weatherCode) {
    if (snowCodes.includes(weatherCode)) {
      return SnowIcon
    } else if (cloudCodes.includes(weatherCode)) {
      return CloudIcon
    } else if (partialCloudCode.includes(weatherCode)) {
      return PartialCloudIcon
    } else if (stormCodes.includes(weatherCode)) {
      return StormIcon
    } else if (rainyCodes.includes(weatherCode)) {
      return RainyIcon
    } else {
      return ClearDayIcon
    }
  } else {
    return ClearDayIcon
  }
}
