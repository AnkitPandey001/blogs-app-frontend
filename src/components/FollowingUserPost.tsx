import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useLike } from "../Hooks/useLike";
import '../index.css'
interface User {
  fullname: string;
  username: string;
  profileImg: string;
}

interface Post {
  _id: string;
  title: string;
  category: string;
  text: string;
  coverImg: string;
  user: User;
  likes: string[];
  comments: { _id: string }[];
}



export const FollowingUserPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const[isLoading,setIsLoading] = useState(false);
  const token = localStorage.getItem("token") || '';
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate();
  const {toggleLike} = useLike();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.post(
          `https://blogs-app-backend-mb0v.onrender.com/api/post/following`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data); 
      } catch (error) {
        console.error("Error:", error);
      }finally{
        setIsLoading(false)
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleProfileClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  if(isLoading){
    return (
      <div className="loader-containers">
        <div className="spinner"></div>
        <p>Loading Post...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Following User Posts</h1>
      {posts.length==0?(<h1 className="font-sans text-3xl text-center text-cyan-900">Not Followed Any User</h1>):
       posts.map((post) => (
        <div
          key={post._id}
          className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row items-stretch"
        >
          {/* User Info Section */}
          <div className="flex items-center space-x-3 mb-3 md:mb-0 md:w-1/4">
            <img
              src={
                post.user.profileImg ||
                "https://imgs.search.brave.com/_5i8rsPM24msre0jZ6yB9i2w8Q4xdb6OoQHmF3kutbM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA4LzQ4LzEyLzI2/LzM2MF9GXzg0ODEy/MjY1NF9PWEgxdUJo/YmduN1c0WHk3YVVV/ZXBxOXV4RDF0YkJw/Zi5qcGc"
              }
              onClick={() => handleProfileClick(post.user.username)}
              alt={post.user.fullname}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
            <div>
              <h2 className="text-lg font-semibold">{post.user.fullname}</h2>
            </div>
          </div>

          {/* Post Content Section */}
          <div className="flex-1">
            <img
              src={
                post.coverImg ||
                "https://imgs.search.brave.com/Kh1SdzT66Lr3MgHl4kuYs2a0DpFyag3op189hGL1sK4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM5/NzY3ODg4MC9waG90/by9jbG9zZXVwLW9m/LWEtYmxhY2stYnVz/aW5lc3N3b21hbi10/eXBpbmctb24tYS1s/YXB0b3Ata2V5Ym9h/cmQtaW4tYW4tb2Zm/aWNlLWFsb25lLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1R/ajlXV3BBb0tCMFc3/ay1jNjhZLThuZU42/YzFtQ0V4bkVPOVVL/Ry1lb1hZPQ"
              }
              alt={post.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Category: {post.category}</p>
            <p className="text-sm text-gray-500 mb-2">{post.text}</p>
            <div className="flex items-center space-x-6 mt-2">
            <span
                onClick={() => toggleLike(post._id)}
                className="cursor-pointer flex items-center space-x-1 text-sm text-gray-600"
              >
                {post.likes.includes(userId || '') ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-lg" />
                )}
                <span className="text-lg font-bold">{post.likes.length}</span>
              </span>
              <span className="flex items-center space-x-1 text-sm text-gray-600">
                <span>Comments:</span>
                <span>{post.comments.length}</span>
              </span>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};
