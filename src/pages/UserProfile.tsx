import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../index.css'
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
}

interface Post {
  _id: string;
  category: string;
  comments: string[];
  createdAt: string;
  likes: string[];
  text: string;
  title: string;
  user: string;
  image?: string; // Add an optional image field
}

export const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://blogs-app-backend-mb0v.onrender.com/api/user/profile/${username}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.user);
        setPosts(response.data.posts); // Assuming the API returns posts as well
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching the data.");
        setLoading(false);
        console.log(error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [username, token]);
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 mt-20 flex flex-col items-center bg-white rounded-lg shadow-md border border-gray-200 max-w-lg mx-auto">
      <div className="w-full flex flex-col items-center space-y-2 mb-4">
        <img
          src={user?.profileImg}
          alt={user?.fullname}
          className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
        />
        <h1 className="text-2xl font-bold text-gray-800">{user?.fullname}</h1>
        <p className="text-sm text-gray-600">@{username}</p>
      </div>

      {/* Bio and Link Section */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">{user?.bio}</p>
        {user?.link && (
          <a href={user.link} className="text-blue-500 hover:underline">
            {user.link}
          </a>
        )}
      </div>

      {/* Followers and Following Counts */}
      <div className="flex justify-around w-full mt-6">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">{user?.follower.length}</h2>
          <p className="text-sm text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">{user?.following.length}</h2>
          <p className="text-sm text-gray-600">Following</p>
        </div>
      </div>

      {/* Displaying Posts */}
      <div className="w-full mt-6">
        {posts.length === 0 ? (
          <div>No posts to display.</div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="mb-6 border-b border-gray-200 pb-4">
               <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-64 object-cover mt-4 rounded-lg"
                />

              <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
              <p className="text-sm text-gray-600">{post.text}</p>
              
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{post.likes.length} Likes</span>
                <span>{post.comments.length} Comments</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
