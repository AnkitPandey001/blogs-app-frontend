import { useBlogs } from "../context/BlogsContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TfiComments } from "react-icons/tfi";
import { useFollow } from "../Hooks/userFollow";
import { useLike } from "../Hooks/useLike";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Coments } from "./Coments";
import "../index.css";
import { AxiosError } from "../utils/Utils";

interface BlogListProps {
  category: string;
}

export const BlogList = ({ category }: BlogListProps) => {
  const { blogs } = useBlogs();
  const loggedInUser = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { toggleFollow } = useFollow();
  const { toggleLike } = useLike();
  const { fetchBlogs } = useBlogs();

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const [currentPostId, setCurrentPostId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  if (blogs.length === 0) {
    return (
      <div className="loader-containers">
        <div className="spinner"></div>
        <p>Loading Post...</p>
      </div>
    );
  }

  const filteredBlogs = blogs
    .filter((blog: any) => category === "all" || blog.category === category)
    .filter((blog: any) => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleProfileClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleReadMoreClick = (post: any) => {
    navigate("/complete-blogs-details", { state: { post } });
  };

  const handleCommentsClick = async (blogId: string) => {
    setCommentInputs((prev) => ({ ...prev, [blogId]: "" }));
    const commentText = commentInputs[blogId];
    try {
      const response = await axios.post(
        `https://blogs-app-backend-mb0v.onrender.com/api/post/comment/${blogId}`,
        { text: commentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      fetchBlogs();
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.response?.data?.error);
    }
  };

  const handleCommentChange = (blogId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [blogId]: value }));
  };

  const openCommentsModal = (comments: any, postId: any) => {
    setCurrentComments(comments);
    setCurrentPostId(postId);
    setShowCommentsModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Blogs by Title..."
        className="p-4 border border-gray-300 rounded-2xl md:w-[78vh] shadow-lg w-[370px] ml-[-15px] mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredBlogs.map((blog: any) => (
        <div
          key={blog._id}
          className="p-2 bg-[#3C3D37] rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row items-stretch w-[370px] ml-[-15px] md:w-[80vh]"
        >
          {/* Blog Image */}
          <div className="w-full md:w-1/3 flex-shrink-0 md:mt-10">
            <img
              src={
                blog.img ||
                "https://imgs.search.brave.com/5u-GFb6cGxZ4CHPcctmYUPOJqfQkK-X_ckkrkgJS6q8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL25ld19nYWxs/ZXJ5LzYyLTYyOTY4/M19nYW1iYXItbm90/ZS1wbmctZ3JlZW4t/dHJhbnNwYXJlbnQt/cG9zdC1pdC1ub3Rl/LnBuZw"
              }
              alt={blog.title}
              className="w-full h-40 object-cover rounded-lg"
            />
              <button
                onClick={() => handleReadMoreClick(blog)}
                className="px-4 py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Read ➡️
              </button>
          </div>

          {/* Blog Details */}
          <div className="flex-1 md:ml-4 space-y-2 mt-4">
            {/* User Info */}
            <div className="flex items-center justify-start space-x-4">
              <img
                src={
                  blog.user.profileImg ||
                  "https://imgs.search.brave.com/u1yVy9WivIo3f6jXzpqieF0u00WRqplOHBsJS94Ns-U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvNS9Qcm9m/aWxlLUF2YXRhci1Q/TkcucG5n"
                }
                onClick={() => handleProfileClick(blog.user.username)}
                alt={blog.user.fullname}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
              
              <div className="flex">
                <h2 className="text-lg text-white font-semibold bg-slate-800 p-1 rounded">{blog.user.fullname}</h2>
                <button
                  onClick={() => toggleFollow(blog.user._id)}
                  className="text-sm ml-10 bg-slate-50 p-1 rounded-lg font-bold text-blue-900 line-clamp-1 hover:text-blue-700"
                >
                  {blog.user.follower.includes(loggedInUser) ? "unfollow" : "follow"}
                </button>
              </div>
            </div>

            {/* Blog Title and Category */}
            <h2 className="text-xl font-bold text-gray-100">{blog.title}</h2>
            <p className="text-sm text-gray-200">Category: {blog.category}</p>

            {/* Interaction Section */}
            <div className="flex items-center space-x-6">
              <span
                onClick={() => toggleLike(blog._id)}
                className="cursor-pointer flex items-center space-x-1 text-sm text-gray-600"
              >
                {blog.likes.includes(loggedInUser) ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-lg" />
                )}
                <span className="text-lg text-slate-200 font-bold">{blog.likes.length}</span>
              </span>

              <span className="flex items-center space-x-1 text-sm text-gray-100">
                <span className="cursor-pointer">
                  <TfiComments
                    onClick={() => openCommentsModal(blog.comments, blog._id)}
                    size={20}
                    className="mt-2 hover:text-cyan-700"
                  />
                </span>
                <span className="text-xl">{blog.comments.length}</span>
              </span>
            </div>

            {/* Actions */}
            <div className="mt-28">
              <input
                type="text"
                value={commentInputs[blog._id] || ""}
                onChange={(e) => handleCommentChange(blog._id, e.target.value)}
                placeholder="Post Comments"
                className="bg-slate-200 mt-4 rounded-lg p-2 w-full md:w-auto"
              />
              <button
                onClick={() => handleCommentsClick(blog._id)}
                className="text-xl  bg-gray-200 p-1 rounded-lg hover:bg-green-100 cursor-pointer md:ml-2 mt-4"
              >
                ➡️
              </button>
            </div>
          </div>
        </div>
      ))}

      {showCommentsModal && (
        <Coments
          comments={currentComments}
          onClose={() => setShowCommentsModal(false)}
          postId={currentPostId}
        />
      )}
    </div>
  );
};
