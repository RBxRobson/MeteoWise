import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type CityState = {
  coordinates: {
    latitude: number
    longitude: number
  }
  name: string
  country: string
  state?: string
}

const initialState: CityState = {
  coordinates: {
    latitude: -29.0933,
    longitude: -52.5828,
  },
  name: 'Barros Cassal',
  country: 'Brasil',
  state: 'RS',
}

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityState>) => {
      state = action.payload
    },
  },
})

export const { setCity } = citySlice.actions
export default citySlice.reducer
