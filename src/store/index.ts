import { configureStore } from '@reduxjs/toolkit'

import weatherApi from '../services/api'
import cityReducer from './reducers/city'
import dayReducer from './reducers/day'

export const store = configureStore({
  reducer: {
    city: cityReducer,
    day: dayReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(weatherApi.middleware),
})

// Tipos para uso com hooks
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
