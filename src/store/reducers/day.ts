import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type DayState = {
  date: string
  weatherCode: number
}

const initialState: DayState = {
  date: '',
  weatherCode: 0,
}

const DaySlice = createSlice({
  name: 'Day',
  initialState,
  reducers: {
    setDay: (state, action: PayloadAction<DayState>) => {
      state.date = action.payload.date
      state.weatherCode = action.payload.weatherCode
    },
  },
})

export const { setDay } = DaySlice.actions
export default DaySlice.reducer
