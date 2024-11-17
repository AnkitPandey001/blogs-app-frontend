import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  follower: string[];
  following: string[];
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
}

interface Blog {
  _id: string;
  user: User;
  text: string;
  likes: string[];
  category: string;
  title: string;
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogsContextType {
  blogs: Blog[];
  fetchBlogs: () => void;
  getBlogsByCategory: (category: string) => Blog[];
}

const BlogContext = createContext<BlogsContextType | undefined>(undefined);

export const BlogsProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get<Blog[]>('https://blogs-app-backend-mb0v.onrender.com/api/post/getallpost');
      setBlogs(response.data.posts);

    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const getBlogsByCategory = (category: string) => {
    return blogs.filter(blog => blog.category === category);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, fetchBlogs, getBlogsByCategory }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = React.useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
};