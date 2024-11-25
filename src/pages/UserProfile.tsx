import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../index.css";
import { User, Post } from "../utils/Utils";

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
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching the data.");
        setLoading(false);
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
    <div className="p-6 mt-20 flex flex-col items-center bg-gray-900 text-gray-200 rounded-lg shadow-lg border border-gray-700 max-w-lg mx-auto">
      {/* Profile Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-6 bg-gray-800 p-6 rounded-lg">
        <img
          src={user?.profileImg}
          alt={user?.fullname}
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-500"
        />
        <h1 className="text-2xl font-bold text-white">{user?.fullname}</h1>
        <p className="text-sm text-gray-400">@{username}</p>
        <p className="text-sm text-gray-300">{user?.bio}</p>
        {user?.link && (
          <a href={user.link} className="text-blue-400 hover:underline">
            {user.link}
          </a>
        )}
      </div>

      {/* Followers and Following */}
      <div className="w-full flex justify-around items-center bg-gray-800 p-4 rounded-lg mb-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{user?.follower.length}</h2>
          <p className="text-sm text-gray-400">Followers</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{user?.following.length}</h2>
          <p className="text-sm text-gray-400">Following</p>
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full">
        {posts.length === 0 ? (
          <div className="text-center bg-gray-800 p-4 rounded-lg">
            No posts to display.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              {post.img && (
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-lg font-semibold text-white mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-300 mb-2">{post.text}</p>
              <div className="flex justify-between text-sm text-gray-500">
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
