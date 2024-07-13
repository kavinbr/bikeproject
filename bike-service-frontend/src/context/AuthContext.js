import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axios.get('http://localhost:5000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data); 
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
          setLoggedIn(!!token);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user'); 
      }
    } else {
      fetchUser(); 
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); 
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, isOwner, setIsOwner, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
