/* eslint-disable @typescript-eslint/no-explicit-any */
const allowedFeatureCodes = ['PPLC', 'PPLA', 'PPLA2', 'PPL']

export function isValidCity(data: any): boolean {
  if (data.feature_code) {
    return allowedFeatureCodes.includes(data.feature_code)
  } else {
    return false
  }
}
