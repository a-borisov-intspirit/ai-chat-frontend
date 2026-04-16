import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { request } from '../../utils/api';
import { logout } from '../../redux/userSlice';

import './style.scss';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user);
  const handleLogout = async () => {
    await request('http://localhost:3000/auth/logout')();

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    dispatch(logout());
    navigate('/login');
  };
  return (
    <div className="layout">
      <div className="header">
        Remaining tokens per this day: {user.tokens}
        <p>{user.email}</p>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
      {children}
    </div>
  );
};
