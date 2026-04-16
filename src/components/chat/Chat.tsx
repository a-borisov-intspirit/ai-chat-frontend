import { useState, useEffect } from 'react';
import { request } from '../../utils/api';
import { METHOD } from '../../utils/constants';
import { parseMarkdown } from '../../utils/utils';
import { setRemainingTokens } from '../../redux/userSlice';
import './style.scss';
import { ChatHistory } from './ChatHistory/ChatHistory';
import { useSelector, useDispatch } from 'react-redux';

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
}
export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [currentModel, setCurrentModel] = useState<string>('openAi');

  const dispatch = useDispatch();
  const currentChatId = useSelector((state: any) => state.chats.currentChatId);

  const handleSendMessage = async () => {
    if (!currentPrompt) return;
    setCurrentPrompt('');
    setMessages([...messages, { content: currentPrompt, role: 'user' }]);
    const res = await request(
      `http://localhost:3000/chats/${currentChatId}`,
      METHOD.POST,
    )({ content: currentPrompt, owner_id: 0, role: 'user', chat_id: currentChatId, type: currentModel });
    if (res?.data.content) {
      setMessages((prev) => [...prev, { content: parseMarkdown(res?.data.content), role: 'assistant' }]);

      dispatch(setRemainingTokens({ remaining_tokens: res?.data.remainingTokens }));
    }
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!currentChatId) return;
    const fetchMessages = async () => {
      try {
        const res = await request(`http://localhost:3000/chats/${currentChatId}`, METHOD.GET)();
        const data = await res?.data;
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [currentChatId]);

  return (
    <div className="main_wrapper">
      <ChatHistory />
      <div className="chat_wrapper">
        <section id="center">
          {messages.map((message, index) => (
            <div key={index} className={`message  ${message.role === 'assistant' ? 'left' : 'right'}`}>
              <div className={`message_wrapper`} dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
            </div>
          ))}
        </section>
        <section id="spacer">
          <select onChange={(e) => setCurrentModel(e.target.value)}>
            <option value="openAi">openAi</option>
            <option value="claude">claude</option>
          </select>
          <input
            type="text"
            placeholder="Type something..."
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            onKeyDown={onEnterPress}
          />
          <button onClick={handleSendMessage}>Send</button>
        </section>
      </div>
    </div>
  );
};
