import { Routes, Route, Navigate } from 'react-router';
import { Login } from '../components/login/Login';
import { Chat } from '../components/chat/Chat';
const Router = () => {
  const PrivateRoute = ( {children} : any): any => {
    const isAuthenticated = false; // Replace with actual authentication logic
    console.log(123, children);
    
  return isAuthenticated ? children : <Navigate to="/login" />;
};

  return (
    <Routes>
      <Route element={<Login />} path="/login" />
      <Route
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
          }
        path="/chat"
      />
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  );
};

export default Router;