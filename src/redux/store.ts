import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import chatsSlice from './chatsSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    chats: chatsSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch