import { useState } from "react";
import { request } from "../../utils/api";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
  }

  const handleLogin = () => {
   const res = request('http://localhost:3000/auth/create')({ email: username, password })
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