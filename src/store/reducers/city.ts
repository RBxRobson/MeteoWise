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
  state: 'Rio Grande do Sul',
}

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityState>) => {
      state.coordinates = action.payload.coordinates
      state.name = action.payload.name
      state.country = action.payload.country
      state.state = action.payload.state
    },
  },
})

export const { setCity } = citySlice.actions
export default citySlice.reducer
