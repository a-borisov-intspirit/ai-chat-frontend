import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setCurrentChat, setChatsR, deleteChat } from '../../../redux/chatsSlice';
import { createChat as createChatRow, fetchChats, removeChat } from '../../../utils/chatApi';
import { supabase } from '../../../utils/supabase';

import closeIcon from '../../../assets/close.svg';

import './style.scss';
import type { RootState } from '../../../redux/store';

export const ChatHistory = () => {
  const { chats, currentChatId } = useSelector((state: RootState) => state.chats);
  const dispatch = useDispatch();

  const selectChat = (id: number) => dispatch(setCurrentChat({ id }));
  const handleCreateChat = async () => {
    const chat = await createChatRow();
    dispatch(setChatsR({ chats: [chat, ...chats] }));
    selectChat(chat.id);
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await removeChat(id);
    dispatch(deleteChat({ id }));
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fetchChats();
        dispatch(setChatsR({ chats: data }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('chats-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chats' },
        () => {
          fetchChats()
            .then((data) => dispatch(setChatsR({ chats: data })))
            .catch(console.error);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch]);

  return (
    <div className="chat_history_wrapper">
      <button onClick={handleCreateChat}>Create new chat</button>
      <div className="chats_list">
        {!!chats?.length &&
          chats?.map((chat) => (
            <div
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              className={`chat_item ${currentChatId === chat.id ? 'active' : ''}`}
            >
              <p>{chat.name}</p>
              <img src={closeIcon} alt="close" onClick={(e) => handleDeleteChat(e, chat.id)} className="delete_icon" />
            </div>
          ))}
        {!chats?.length && <div>No chats for now</div>}
      </div>
    </div>
  );
};
