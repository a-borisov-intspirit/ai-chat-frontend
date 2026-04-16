import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { request } from '../../utils/api';
import { login } from '../../redux/userSlice';

export const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
  };

  const handleLogin = async () => {
    try {
      const res = await request('http://localhost:3000/auth/login')({ email: username, password });
      if (res?.status === 200) {
        localStorage.setItem('access_token', res?.data.accessToken);
        localStorage.setItem('user_id', res?.data.id);
        dispatch(login({ email: username, id: res?.data.id, accessToken: res?.data.accessToken }));
        navigate('/chat');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Login
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={toggleForm}>Create new user</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
