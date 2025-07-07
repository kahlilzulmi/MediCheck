import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me');
      setUser(res.data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError('Failed to fetch user info.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch riwayat
  const fetchRiwayat = useCallback(async () => {
    try {
      const res = await api.get('/riwayat');
      setRiwayat(res.data);
    } catch (err) {
      setRiwayat([]);
    }
  }, []);

  // Refetch all user-related data
  const refreshAll = useCallback(async () => {
    await fetchUser();
    await fetchRiwayat();
  }, [fetchUser, fetchRiwayat]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      refreshAll();
    } else {
      setUser(null);
      setRiwayat([]);
      setLoading(false);
    }
  }, [refreshAll]);

  // Device registration helpers
  const registerDevice = async (address, name) => {
    await api.post('/device/register', { address, name });
    await fetchUser();
  };
  const unregisterDevice = async () => {
    await api.delete('/device/unregister');
    await fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, riwayat, setRiwayat, loading, error, fetchUser, fetchRiwayat, refreshAll, registerDevice, unregisterDevice }}>
      {children}
    </UserContext.Provider>
  );
}
