import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { login } from '../../redux/userSlice';
import { supabase } from '../../utils/supabase';

export const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
  };

  const handleSubmit = async () => {
    try {
      const action = isNewUser
        ? supabase.auth.signUp({ email: username, password })
        : supabase.auth.signInWithPassword({ email: username, password });

      const { data, error } = await action;

      if (error) {
        throw error;
      }

      const session = data.session;
      const user = data.user || session?.user;

      if (session && user) {
        localStorage.setItem('access_token', session.access_token);
        localStorage.setItem('user_id', user.id);
        dispatch(login({ email: user.email, id: user.id, accessToken: session.access_token }));
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
      <button onClick={toggleForm}>{isNewUser ? 'Already have an account' : 'Create new user'}</button>
      <button onClick={handleSubmit}>{isNewUser ? 'Sign up' : 'Login'}</button>
    </div>
  );
};
