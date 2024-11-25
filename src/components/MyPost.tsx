import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AxiosError } from "../utils/Utils";
import { Coments } from "./Coments";

interface MyPostProps {
  posts: any[];
  fetchBlogs: () => void;
  updateUser: () => void;
}

export const MyPost: React.FC<MyPostProps> = ({ posts, fetchBlogs, updateUser }) => {
  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(
        `https://blogs-app-backend-mb0v.onrender.com/api/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Post deleted successfully");
      updateUser();
      fetchBlogs();
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.response?.data?.error || "Error deleting post");
    }
  };

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={post.img}
              alt="Post"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              <span className="font-bold">Category:</span> {post.category}
            </h4>
            <p className="text-gray-700 mb-2">
              <span className="font-bold text-xl">Title:</span> {post.title}
            </p>
            <p className="text-gray-700 mb-2">{post.text}</p>
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <div>
                <span>{post.likes.length} Likes</span>
                <span className="ml-7">{post.comments.length} Comments</span>
              </div>
              <button
                onClick={() => handleDeletePost(post._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">No posts available</p>
      )}
    </div>
  );
};
