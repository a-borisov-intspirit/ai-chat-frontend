import { createSlice } from '@reduxjs/toolkit'

interface IChat {
  id: number,
  name: string,
  owner_id: number,
  created_at: string
}
export const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [] as IChat[],
    currentChatId: null,
  },
  reducers: {
    setChatsR: (state, action) => {
      const { chats } = action.payload
      state.chats = chats
    },
    setCurrentChat: (state, action) => {
      const { id } = action.payload
      state.currentChatId = id
    },
    deleteChat: (state, action) => {
      const { id } = action.payload
      state.chats = state.chats.filter(chat => chat.id !== id)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChatsR, setCurrentChat, deleteChat } = chatsSlice.actions

export default chatsSlice.reducer

