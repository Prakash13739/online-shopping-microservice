import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ApiActivityProvider, useApiActivity } from './context/ApiActivityContext';
import { setGlobalActivityLogger } from './api/axiosClient';
import AppRoutes from './routes/AppRoutes';

const ApiLoggerInitializer = ({ children }) => {
  const { logActivity } = useApiActivity();
  useEffect(() => {
    setGlobalActivityLogger(logActivity);
  }, [logActivity]);
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <ApiActivityProvider>
        <ApiLoggerInitializer>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ApiLoggerInitializer>
      </ApiActivityProvider>
    </BrowserRouter>
  );
}
