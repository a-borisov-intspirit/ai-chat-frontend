import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { request } from '../../../utils/api';
import { METHOD } from '../../../utils/constants';
import { setCurrentChat, setChatsR, deleteChat } from '../../../redux/chatsSlice';

import closeIcon from '../../../assets/close.svg';

import './style.scss';
import type { RootState } from '../../../redux/store';

export const ChatHistory = () => {
  const user = useSelector((state: any) => state.user);
  const { chats, currentChatId } = useSelector((state: RootState) => state.chats);
  const dispatch = useDispatch();

  const selectChat = (id: number) => dispatch(setCurrentChat({ id }));
  const createChat = async () => {
    const res = await request('http://localhost:3000/chats', METHOD.POST)({ owner_id: user.id });
    const data = res?.data;
    dispatch(setChatsR({ chats: [...chats, ...data] }));
    selectChat(data[0].id);
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const res = await request(`http://localhost:3000/chats/${id}`, METHOD.DELETE)();
    if (res?.data) {
      dispatch(deleteChat({ id }));
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await request('http://localhost:3000/chats', METHOD.GET)();
        const data = await res?.data;
        if (!!data) {
          dispatch(setChatsR({ chats: data }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="chat_history_wrapper">
      <button onClick={createChat}>Create new chat</button>
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
