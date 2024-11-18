
export interface AxiosError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export interface User {
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

export interface LoggedUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  follower: string[];
  following: string[];
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
}

export interface Post {
  _id: string;
  title: string;
  text: string;
  img: string;
  likes: string[];
  comments: string[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: () => void;
  LogUser: LoggedUser | null;
}

// New Interfaces for Blogs
export interface Blog {
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

export interface BlogsApiResponse {
  posts: Blog[];
}

export interface BlogsContextType {
  blogs: Blog[];
  fetchBlogs: () => void;
  getBlogsByCategory: (category: string) => Blog[];
}


export interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
    fullname: string;
    profileImg?: string;
  } | null;
  createdAt: string;
}

export interface CommentsProps {
  comments: Comment[];
  onClose: () => void;
  postId: string;
}