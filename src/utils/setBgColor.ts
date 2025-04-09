import { allCloudyCodes, rainyCodes } from './weatherCodes'

// Função para definir a cor de fundo de acordo com o clima
export const setBgColor = (weatherCode: number | undefined) => {
  if (weatherCode) {
    if (rainyCodes.includes(weatherCode)) {
      return 'bg-rainy'
    } else if (allCloudyCodes.includes(weatherCode)) {
      return 'bg-cloudy'
    } else {
      return 'bg-sunny'
    }
  } else {
    return 'bg-sunny'
  }
}
