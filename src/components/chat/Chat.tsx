import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { request } from '../../utils/api'
import { METHOD } from '../../utils/constants'
import { parseMarkdown } from '../../utils/utils'
import './style.scss'
import type { RootState } from '../../redux/store'

interface Message {
  text: string
  owner: 'user' | 'bot'
}
export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPrompt, setCurrentPrompt] = useState<string>('')
  const user = useSelector((state: RootState) => state.user.value)

  const handleSendMessage = async() => {
    setMessages([...messages, { text: currentPrompt, owner: 'user' }])
    const res = await request('http://localhost:3000/user_messages', METHOD.POST)({ text: currentPrompt,owner_id:0, role: "user" })
    if (res?.data.output_text) {
      setMessages(prev => [...prev, { text: parseMarkdown(res?.data.output_text), owner: 'bot' }])
    }
    setCurrentPrompt('')
  }

  useEffect(() => {
    const data =request('http://localhost:3000/user_messages', METHOD.GET)
    // setMessages(data)
  }, [])

  return (
    <div className='chat_wrapper'>
      <section id="center">
        {messages.length}
        {messages.map((message, index) => (
          <div key={index} className={`message  ${message.owner === 'bot' ? 'left' : 'right'}`}>
            <div className={`message_wrapper`}>{message.text}</div>
          </div>
        ))}
      </section>
      <section id="spacer">
        <input type="text" placeholder="Type something..." value={currentPrompt} onChange={(e) => setCurrentPrompt(e.target.value)} />
        <button onClick={handleSendMessage}>Send</button>
      </section>
    </div>
  )
}