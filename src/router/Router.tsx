import { Routes, Route, Navigate } from 'react-router';
import { Login } from '../components/login/Login';
import { Chat } from '../components/chat/Chat';
import { Layout } from '../components/layout/Layout';
const Router = () => {
  const PrivateRoute = ({ children }: any): any => {
    const token = localStorage.getItem('access_token');
    const isAuthenticated = !!token;

    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route element={<Login />} path="/login" />
      <Route
        element={
          <PrivateRoute>
            <Layout>
              <Chat />
            </Layout>
          </PrivateRoute>
        }
        path="/chat"
      />
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  );
};

export default Router;
