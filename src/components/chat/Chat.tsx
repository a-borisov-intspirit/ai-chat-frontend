import { useState, useEffect } from 'react'
import '../../App.scss'
import { request } from '../../utils/api'
import { METHOD } from '../../utils/constants'

interface Message {
  text: string
  owner: 'user' | 'bot'
}
export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPrompt, setCurrentPrompt] = useState<string>('')
  
  const handleSendMessage = () => {
    setMessages([...messages, { text: currentPrompt, owner: 'user' }])
    setCurrentPrompt('')
  }

  useEffect(() => {
    const data =request('http://localhost:3000/user_messages', METHOD.GET)
    // setMessages(data)
  }, [])

  return (
    <div>
      <section id="center">
        {messages.length}
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className={`message_wrapper ${message.owner === 'bot' ? 'left' : 'right'}`}>{message.text}</div>
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