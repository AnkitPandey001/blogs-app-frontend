import  { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import React from 'react'

interface User {
  _id: string;
  fullname: string;
  email: string;
  follower: string[];
  following: string[];
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  posts: Post[];
}

interface LoggedUser {
  _id: string;
  fullname: string;
  username:string
  email: string;
  follower: string[];
  following: string[];
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
}

interface Post {
  _id: string;
  title: string;
  text: string;
  img:string;
  likes: string[];
  comments: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: () => void;
  LogUser:LoggedUser | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const[LogUser,setLoggedUser] = useState<LoggedUser | null>(null)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    toast.success("Logout Sucess", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    setIsAuthenticated(false);
  };

  const updateUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://blogs-app-backend-mb0v.onrender.com/api/auth/me', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUser(response.data);
        setLoggedUser(response.data.user)
      })
      .catch(error => {
        console.error("Error updating user data:", error);
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,user, login, logout,updateUser,LogUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};