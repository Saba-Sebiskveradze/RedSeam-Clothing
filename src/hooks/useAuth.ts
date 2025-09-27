import { useCallback } from 'react';

export const useAuth = () => {
  const getToken = useCallback((): string | null => {
    return localStorage.getItem('token');
  }, []);

  const isAuthenticated = useCallback((): boolean => {
    return !!getToken();
  }, [getToken]);

  return {
    getToken,
    isAuthenticated,
  };
};