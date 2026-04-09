import { useState, useEffect } from "react"
import { request } from "../../../utils/api"
import { METHOD } from "../../../utils/constants"
export const ChatHistory = () => {
  const [chats, setChats] = useState([]) 

  
    useEffect(() => {
      const data =request('http://localhost:3000/user_messages', METHOD.GET)
      // setMessages(data)
    }, [])

  return (
    <div className="chat_history_wrapper">
      <button>Create new chat</button>
    </div>
  )
}