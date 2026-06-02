import { useState, useEffect } from 'react';
import { request } from '../../utils/api';
import { METHOD } from '../../utils/constants';
import { parseMarkdown } from '../../utils/utils';
import { setRemainingTokens } from '../../redux/userSlice';
import './style.scss';
import { ChatHistory } from './ChatHistory/ChatHistory';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages as fetchChatMessages, insertMessage } from '../../utils/chatApi';
import { supabase } from '../../utils/supabase';

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
    if (!currentChatId) return;
    setCurrentPrompt('');
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const nextMessages = [...messages, { content: currentPrompt, role: 'user' as const }];
    setMessages(nextMessages);

    await insertMessage({
      chat_id: currentChatId,
      owner_id: userId,
      role: 'user',
      content: currentPrompt,
    });

    const res = await request(
      'http://localhost:3000/chats/message',
      METHOD.POST,
    )({
      content: currentPrompt,
      type: currentModel,
      history: nextMessages,
    });

    if (res?.data.content) {
      const assistantMessage = { content: res.data.content, role: 'assistant' as const };
      setMessages((prev) => [
        ...prev,
        { content: parseMarkdown(assistantMessage.content), role: assistantMessage.role },
      ]);

      await insertMessage({
        chat_id: currentChatId,
        owner_id: userId,
        role: 'assistant',
        content: res.data.content,
      });

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
    const loadMessages = async () => {
      try {
        const data = await fetchChatMessages(currentChatId);
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();
  }, [currentChatId]);

  useEffect(() => {
    if (!currentChatId) return;

    const channel = supabase
      .channel(`messages:${currentChatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${currentChatId}`,
        },
        () => {
          fetchChatMessages(currentChatId)
            .then((data) => setMessages(data))
            .catch(console.error);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
