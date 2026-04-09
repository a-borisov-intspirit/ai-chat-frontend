import { useState } from "react";
import { request } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
  }

  const handleLogin = async () => {
    try {
      const res = await request('http://localhost:3000/auth/login')({ email: username, password })
      if (res?.status === 200) navigate('/chat');

    } catch (error) {
      console.log(error);
    }
    
    
    
  }
  return (
    <div> 
      Login
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={toggleForm}>Create new user</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}