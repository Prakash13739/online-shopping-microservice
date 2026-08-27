import React, { createContext, useContext, useState, useCallback } from 'react';

const ApiActivityContext = createContext();

export const ApiActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      method: 'GET',
      endpoint: '/api/products?page=0&size=12',
      status: 200,
      duration: 34,
      timestamp: new Date().toLocaleTimeString(),
      service: 'Product Service'
    },
    {
      id: 2,
      method: 'GET',
      endpoint: '/api/categories',
      status: 200,
      duration: 22,
      timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
      service: 'Product Service'
    }
  ]);

  const logActivity = useCallback((activity) => {
    setActivities((prev) => [
      {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        ...activity
      },
      ...prev.slice(0, 49) // Keep last 50 requests
    ]);
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  return (
    <ApiActivityContext.Provider value={{ activities, logActivity, clearActivities }}>
      {children}
    </ApiActivityContext.Provider>
  );
};

export const useApiActivity = () => useContext(ApiActivityContext);
