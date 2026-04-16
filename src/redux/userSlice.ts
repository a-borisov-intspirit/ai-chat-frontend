import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    email: null,
    accessToken: null,
    tokens: 10000

  },
  reducers: {
    login: (state, action) => {
      const { email, id, accessToken } = action.payload
      state.id = id
      state.email = email
      state.accessToken = accessToken
    },
    logout: (state) => {
      state.id = null
      state.email = null
      state.accessToken = null
    },
    setRemainingTokens: (state, action) => {
      state.tokens = action.payload.remaining_tokens
    }
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, setRemainingTokens } = userSlice.actions

export default userSlice.reducer

