// Descrição dos códigos meteorológicos
export const getWeatherDescription = (code: number): string => {
  const weatherDescriptions: { [key: number]: string } = {
    0: 'Ensolarado',
    1: 'Tempo limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nublado com alta umidade',
    48: 'Neblina com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa forte',
    56: 'Garoa com geada',
    57: 'Garoa com geada',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    66: 'Chuva congelante leve',
    67: 'Chuva congelante forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve intensa',
    77: 'Granizo fino',
    80: 'Pancadas leves de chuva ',
    81: 'Pancadas chuva',
    82: 'Pancadas fortes de chuva ',
    85: 'Pancadas leves de neve ',
    86: 'Pancadas fortes de neve ',
    95: 'Tempestade',
    96: 'Tempestade com granizo',
    99: 'Tempestade severa com granizo',
  }

  return weatherDescriptions[code] || 'Condição desconhecida'
}

// Constantes por tipo de clima
export const clearCodes = [0, 1]

export const partialCloudCode = [2]
export const cloudCodes = [3, 45, 48]

export const drizzleCodes = [51, 53, 55]
export const freezingDrizzleCodes = [56, 57]

export const rainCodes = [61, 63, 65]
export const freezingRainCodes = [66, 67]

export const snowCodes = [71, 73, 75]
export const hailCodes = [77]

export const rainShowerCodes = [80, 81, 82]
export const snowShowerCodes = [85, 86]

export const stormCodes = [95, 96, 99]

// Agrupamentos compostos
export const rainyCodes = [
  ...drizzleCodes,
  ...freezingDrizzleCodes,
  ...rainCodes,
  ...freezingRainCodes,
  ...rainShowerCodes,
  ...stormCodes,
]

export const snowyCodes = [...snowCodes, ...snowShowerCodes]

export const allCloudyCodes = [...cloudCodes, partialCloudCode]
